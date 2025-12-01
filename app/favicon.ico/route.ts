import { readFile } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Serve the SVG icon as favicon
    const iconPath = join(process.cwd(), 'app', 'icon.svg')
    const iconContent = await readFile(iconPath, 'utf-8')
    
    return new NextResponse(iconContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    // If icon.svg doesn't exist, return 204 No Content
    return new NextResponse(null, { status: 204 })
  }
}

