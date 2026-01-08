import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      companyName,
      message,
      scheduleCall,
      agencySlug,
      submissionType = 'gtm_consultation',
    } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await sql`
      INSERT INTO contact_submissions (
        submission_type,
        full_name,
        email,
        company_name,
        message,
        schedule_call,
        site,
        created_at
      ) VALUES (
        ${submissionType},
        ${fullName},
        ${email},
        ${companyName || null},
        ${message || null},
        ${scheduleCall || false},
        'gtm',
        NOW()
      )
      RETURNING id
    `;

    // If contacting a specific agency, we could notify them here
    if (agencySlug) {
      console.log(`[Contact] User ${email} wants to contact agency: ${agencySlug}`);
    }

    return NextResponse.json({
      success: true,
      id: result[0]?.id,
      message: 'Contact request submitted successfully',
    });
  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact request' },
      { status: 500 }
    );
  }
}
