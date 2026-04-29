import { createClient } from '@/lib/actions'

export default function NewClientPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Client</h1>
      <p className="text-gray-500 text-sm mb-8">
        Paste in the client's tone of voice guide and brand strategy to power the prompts.
      </p>

      <form action={createClient} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Client Name
          </label>
          <input
            name="name"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g. Fusion Tech"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tone of Voice Guide
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Paste the full ToV guide here. This gets included in every prompt as context.
          </p>
          <textarea
            name="tov_guide"
            rows={12}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
            placeholder="Paste the client's tone of voice guide..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Brand Strategy <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Positioning statement, ICP, key messages. Gets appended to the system context.
          </p>
          <textarea
            name="brand_strategy"
            rows={8}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
            placeholder="Paste brand strategy content..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
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
