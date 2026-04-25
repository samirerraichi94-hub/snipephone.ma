export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-gray-200 border-t-[#E8691A]"
        style={{ width: size, height: size }}
      />
    </div>
  )
}
