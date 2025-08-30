'use client';

type SectionLoaderProps = {
  height?: string;
  className?: string;
};

export function SectionLoader({ height = 'min-h-[400px]', className = '' }: SectionLoaderProps) {
  return (
    <div className={`${height} animate-pulse bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      <div className="container mx-auto px-4 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Header skeleton */}
          <div className="mb-16 text-center">
            <div className="mx-auto mb-4 h-8 w-64 animate-pulse rounded bg-gray-200" />
            <div className="mx-auto h-1 w-24 rounded bg-gray-200" />
            <div className="mx-auto mt-6 h-4 w-96 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Content skeleton */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="space-y-4">
              <div className="h-6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
