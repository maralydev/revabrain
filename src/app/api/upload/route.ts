import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/shared/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

// Create uploads folder if it doesn't exist
async function ensureUploadDir(subFolder: string = 'general') {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subFolder);
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch {
    // Folder exists or cannot be created
  }
  return uploadDir;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'Geen bestand geüpload' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Ongeldig bestandstype. Alleen JPG, PNG, GIF en WebP zijn toegestaan.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Bestand te groot. Maximum is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = path.extname(file.name) || '.jpg';
    const filename = `${randomUUID()}${ext}`;

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir(folder);
    const filePath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het uploaden' },
      { status: 500 }
    );
  }
}

// Get list of uploaded images (for media library)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
    }

    // Get folder from query params
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'general';

    // List files in folder
    const { readdir, stat } = await import('fs/promises');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

    try {
      const files = await readdir(uploadDir);
      const imageFiles = await Promise.all(
        files
          .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
          .map(async (f) => {
            const filePath = path.join(uploadDir, f);
            const stats = await stat(filePath);
            return {
              filename: f,
              url: `/uploads/${folder}/${f}`,
              size: stats.size,
              created: stats.birthtime,
            };
          })
      );

      // Sort by creation date (newest first)
      imageFiles.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

      return NextResponse.json({ images: imageFiles });
    } catch {
      // Folder doesn't exist yet
      return NextResponse.json({ images: [] });
    }
  } catch (error) {
    console.error('Get images error:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}
