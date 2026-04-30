export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { updateClient } from '@/lib/actions'
import Link from 'next/link'

async function getClient(id: string) {
  const { data } = await supabase.from('clients').select('*').eq('id', id).single()
  return data
}

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = await getClient(id)
  if (!client) notFound()

  const update = updateClient.bind(null, id)

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/" className="text-gray-400 hover:text-gray-600">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <Link href={`/clients/${id}`} className="text-gray-400 hover:text-gray-600">{client.name}</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600">Edit</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Client</h1>
      <p className="text-gray-500 text-sm mb-8">Update the ToV guide after each approved post using Prompt 04's output.</p>

      <form action={update} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Client Name</label>
          <input
            name="name"
            required
            defaultValue={client.name}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Google Drive Folder URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">The client's main Drive folder for post subfolders.</p>
          <input
            name="google_drive_folder_url"
            type="url"
            defaultValue={client.google_drive_folder_url || ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
            placeholder="https://drive.google.com/drive/folders/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tone of Voice Guide</label>
          <p className="text-xs text-gray-400 mb-2">Paste the updated guide here after each Prompt 04 run.</p>
          <textarea
            name="tov_guide"
            rows={16}
            defaultValue={client.tov_guide || ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00] font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Brand Strategy <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="brand_strategy"
            rows={8}
            defaultValue={client.brand_strategy || ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00] font-mono"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-[#D48B00] hover:bg-[#b87700] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Save Changes
          </button>
          <Link
            href={`/clients/${id}`}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium px-5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
