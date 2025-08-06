import { NextRequest, NextResponse } from 'next/server';
import { archiveOldAnnouncements } from '@/lib/announcements';

// Archive announcements older than 30 days
export async function POST(request: NextRequest) {
  try {
    const success = await archiveOldAnnouncements();
    
    if (success) {
      return NextResponse.json({
        message: 'Announcements archived successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to archive announcements' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in archive API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}