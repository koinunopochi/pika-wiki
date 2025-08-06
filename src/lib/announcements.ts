import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface AnnouncementLink {
  url: string;
  text: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority?: 'info' | 'warning' | 'critical';
  links?: AnnouncementLink[];
}

export interface AnnouncementsData {
  announcements: Announcement[];
}

export interface AnnouncementsArchive {
  archived: Announcement[];
  lastArchived?: string;
}

// Get announcements from R2 (filtered to last 30 days)
export async function getAnnouncements(): Promise<Announcement[] | null> {
  try {
    const context = await getCloudflareContext();
    if (!context.env.WIKI_DOCS) {
      console.error('R2 bucket not configured');
      return null;
    }

    const object = await context.env.WIKI_DOCS.get('data/announcements/current.json');
    
    if (!object) {
      return null;
    }

    const data = await object.json() as AnnouncementsData;
    
    // Filter announcements to only include those from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filteredAnnouncements = data.announcements.filter(announcement => {
      const announcementDate = new Date(announcement.date);
      return announcementDate >= thirtyDaysAgo;
    });
    
    return filteredAnnouncements;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return null;
  }
}


// Save announcements to R2 (for admin use)
export async function saveAnnouncements(announcements: Announcement[]): Promise<boolean> {
  try {
    const context = await getCloudflareContext();
    if (!context.env.WIKI_DOCS) {
      console.error('R2 bucket not configured');
      return false;
    }

    const data: AnnouncementsData = { announcements };
    
    await context.env.WIKI_DOCS.put(
      'data/announcements/current.json',
      JSON.stringify(data, null, 2),
      {
        httpMetadata: {
          contentType: 'application/json',
        },
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error saving announcements:', error);
    return false;
  }
}

// Archive old announcements (move announcements older than 30 days to archive)
export async function archiveOldAnnouncements(): Promise<boolean> {
  try {
    const context = await getCloudflareContext();
    if (!context.env.WIKI_DOCS) {
      console.error('R2 bucket not configured');
      return false;
    }

    // Get current announcements
    const announcementsObject = await context.env.WIKI_DOCS.get('docs/announcements/announcements.json');
    if (!announcementsObject) {
      console.log('No announcements to archive');
      return true;
    }

    const announcementsData = await announcementsObject.json() as AnnouncementsData;
    
    // Get current archive
    let archiveData: AnnouncementsArchive = { archived: [] };
    const archiveObject = await context.env.WIKI_DOCS.get('data/announcements/archive.json');
    if (archiveObject) {
      archiveData = await archiveObject.json() as AnnouncementsArchive;
    }

    // Filter announcements by date
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeAnnouncements: Announcement[] = [];
    const toArchive: Announcement[] = [];
    
    announcementsData.announcements.forEach(announcement => {
      const announcementDate = new Date(announcement.date);
      if (announcementDate >= thirtyDaysAgo) {
        activeAnnouncements.push(announcement);
      } else {
        toArchive.push(announcement);
      }
    });

    // If nothing to archive, return early
    if (toArchive.length === 0) {
      console.log('No announcements to archive');
      return true;
    }

    // Add to archive (newer items first)
    archiveData.archived = [...toArchive, ...archiveData.archived];
    archiveData.lastArchived = new Date().toISOString();

    // Save updated announcements
    await context.env.WIKI_DOCS.put(
      'data/announcements/current.json',
      JSON.stringify({ announcements: activeAnnouncements }, null, 2),
      {
        httpMetadata: {
          contentType: 'application/json',
        },
      }
    );

    // Save updated archive
    await context.env.WIKI_DOCS.put(
      'data/announcements/archive.json',
      JSON.stringify(archiveData, null, 2),
      {
        httpMetadata: {
          contentType: 'application/json',
        },
      }
    );

    console.log(`Archived ${toArchive.length} announcements`);
    return true;
  } catch (error) {
    console.error('Error archiving announcements:', error);
    return false;
  }
}

// Get archived announcements
export async function getArchivedAnnouncements(): Promise<AnnouncementsArchive | null> {
  try {
    const context = await getCloudflareContext();
    if (!context.env.WIKI_DOCS) {
      console.error('R2 bucket not configured');
      return null;
    }

    const object = await context.env.WIKI_DOCS.get('docs/announcements/announcements-archive.json');
    
    if (!object) {
      return null;
    }

    const data = await object.json() as AnnouncementsArchive;
    return data;
  } catch (error) {
    console.error('Error fetching archived announcements:', error);
    return null;
  }
}