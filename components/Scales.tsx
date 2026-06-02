export function Scales() {
  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 h-full w-[18px] border-r border-neutral-200 dark:border-neutral-800"
        style={{
          backgroundImage:
            'repeating-linear-gradient(315deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
          backgroundSize: '8px 8px',
          color: 'rgb(200 200 200 / 0.5)',
        }}
      />
      <div
        className="pointer-events-none fixed right-0 top-0 h-full w-[18px] border-l border-neutral-200 dark:border-neutral-800"
        style={{
          backgroundImage:
            'repeating-linear-gradient(315deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
          backgroundSize: '8px 8px',
          color: 'rgb(200 200 200 / 0.5)',
        }}
      />
    </>
  )
}
