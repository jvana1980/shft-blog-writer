import { createClient } from '@/lib/actions'

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00] focus:border-transparent'
const fileClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00] focus:border-transparent file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-[#D48B00]/10 file:text-[#D48B00] hover:file:bg-[#D48B00]/20 cursor-pointer'

export default function NewClientPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Client</h1>
      <p className="text-gray-500 text-sm mb-8">
        Upload the client's tone of voice guide and brand strategy to power the prompts.
      </p>

      <form action={createClient} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Client Name
          </label>
          <input
            name="name"
            required
            className={inputClass}
            placeholder="e.g. Fusion Tech"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Google Drive Folder URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            The client's main Drive folder. Posts will get subfolders created here automatically.
          </p>
          <input
            name="google_drive_folder_url"
            type="url"
            className={inputClass}
            placeholder="https://drive.google.com/drive/folders/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tone of Voice Guide
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Upload a PDF or Markdown file. This gets included in every prompt as context.
          </p>
          <input
            name="tov_guide_file"
            type="file"
            accept=".pdf,.md,.txt"
            className={fileClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Brand Strategy <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Positioning statement, ICP, key messages. Upload a PDF or Markdown file.
          </p>
          <input
            name="brand_strategy_file"
            type="file"
            accept=".pdf,.md,.txt"
            className={fileClass}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-[#D48B00] hover:bg-[#b87700] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Create Client
          </button>
          <a
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm font-medium px-5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
