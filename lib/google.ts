import 'server-only'
import { google } from 'googleapis'

function getAuth() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not set.')
  const credentials = JSON.parse(keyJson)
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/documents',
    ],
  })
}

export function extractFolderIdFromUrl(url: string): string | null {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

export async function createPostFolder(
  parentFolderId: string,
  folderName: string,
): Promise<string> {
  const auth = getAuth()
  const drive = google.drive({ version: 'v3', auth })
  const res = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    },
    fields: 'id',
  })
  return res.data.id!
}

export async function createFeedbackDoc(
  folderId: string,
  docName: string,
): Promise<{ id: string; url: string }> {
  const auth = getAuth()
  const drive = google.drive({ version: 'v3', auth })
  const res = await drive.files.create({
    requestBody: {
      name: docName,
      mimeType: 'application/vnd.google-apps.document',
      parents: [folderId],
    },
    fields: 'id,webViewLink',
  })
  return {
    id: res.data.id!,
    url: res.data.webViewLink!,
  }
}

export async function createOutlineDoc(
  folderId: string,
  docName: string,
  content: string,
): Promise<{ id: string; url: string }> {
  const auth = getAuth()
  const drive = google.drive({ version: 'v3', auth })
  const docs = google.docs({ version: 'v1', auth })

  // Create the empty Google Doc in the specified folder
  const file = await drive.files.create({
    requestBody: {
      name: docName,
      mimeType: 'application/vnd.google-apps.document',
      parents: [folderId],
    },
    fields: 'id,webViewLink',
  })

  const docId = file.data.id!

  // Insert the outline content into the doc
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: content,
          },
        },
      ],
    },
  })

  return {
    id: docId,
    url: file.data.webViewLink!,
  }
}
