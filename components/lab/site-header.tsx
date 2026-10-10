import { FlaskConical, Leaf, Shield } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-4">
          <div
            role="img"
            aria-label="ตราสัญลักษณ์โรงเรียน (ตำแหน่งสำหรับใส่ตราโรงเรียน)"
            className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background shadow-[0_0_0_4px_rgba(250,204,21,0.12)]"
          >
            <Shield className="size-7 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-pretty text-sm font-semibold leading-snug text-primary md:text-base">
              สื่อการเรียนรู้ห้องปฏิบัติการเสมือน (Virtual Lab) - โรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกันยา
            </p>
            <h1 className="text-pretty text-sm leading-snug text-foreground md:text-base">
              ชุดกระดาษทดสอบจำแนกความเข้มข้นของสารด้วยระยะทางการเคลื่อนที่บนกระดาษจากสารสกัดแก่นฝาง
            </h1>
          </div>
        </div>
        <ul className="flex shrink-0 flex-wrap gap-2" aria-label="แนวคิดหลัก">
          <li className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <Leaf className="size-3.5" aria-hidden="true" />
            Green Chemistry
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <FlaskConical className="size-3.5" aria-hidden="true" />
            Microscale Chemistry
          </li>
        </ul>
      </div>
    </header>
  )
}
