export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground md:px-6 md:text-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-pretty">
            สื่อการเรียนรู้ห้องปฏิบัติการเสมือน (Virtual Lab)
          </p>
          <p className="shrink-0 font-medium text-primary">
            Hatyaiwittayalaisomboonkulkanya School
          </p>
        </div>

        <div className="border-t border-border/50 pt-3 text-center">
          <p className="font-medium text-foreground/80 text-[11px] sm:text-xs">
            พัฒนาโดย นายพชร ดวงอุปะ (เพชร) • โรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกันยา
          </p>
        </div>
      </div>
    </footer>
  )
}
