import { NextRequest, NextResponse } from 'next/server';
import { getAgencyBySlug } from '@/lib/agencies';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);

  if (!agency) {
    return NextResponse.json(
      { error: 'Agency not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(agency);
}
