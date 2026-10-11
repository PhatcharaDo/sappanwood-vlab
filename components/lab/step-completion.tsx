'use client'

import { Button } from '@/components/ui/button'
import { Award, FileText, Mail, Phone, User, ArrowLeft, Printer } from 'lucide-react'

type StepCompletionProps = {
  onBack: () => void
}

export function StepCompletion({ onBack }: StepCompletionProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 md:px-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="size-4" /> กลับสู่หน้าแล็บ
          </Button>
          <h1 className="text-xl font-bold text-foreground">🎉 หน้าสรุปผลและจบหลักสูตร Virtual Lab</h1>
        </div>

        {/* 1. ใบประกาศนียบัตร / ใบอบรม */}
        <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-card to-amber-500/5 p-8 text-center shadow-xl">
          <Award className="mx-auto mb-3 size-16 text-amber-500" />
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
            Certificate of Completion
          </span>
          <h2 className="mt-4 text-2xl font-bold text-foreground">
            ใบประกาศนียบัตรผ่านการอบรมเชิงปฏิบัติการ
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ขอรับรองว่าผู้ใช้งานได้ผ่านการทดลองและปฏิบัติการเสมือนจริงสำเร็จลุล่วง
          </p>
          <div className="my-6 inline-block rounded-xl border border-border bg-background/50 px-6 py-3">
            <p className="text-sm font-semibold text-primary">
              ห้องปฏิบัติการเสมือน (Virtual Lab): µPADs สกัดแก่นฝางและการทดสอบสาร
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              รางวัล DOW-CST Award ประจำปี พ.ศ. 2569
            </p>
          </div>
          <div>
            <Button
              onClick={() => window.print()}
              className="gap-2 bg-amber-600 text-white hover:bg-amber-700"
            >
              <Printer className="size-4" /> พิมพ์ / บันทึกใบประกาศนียบัตร
            </Button>
          </div>
        </section>

        {/* 2. เอกสารใบงาน (Worksheet) */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="size-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              เอกสารใบงานการทดลอง (Worksheet & Reports)
            </h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            ดาวน์โหลดสรุปผลการทดลอง ระยะการเคลื่อนที่ และกราฟความเข้มข้นเพื่อใช้ประกอบรายงาน
          </p>
          <Button variant="outline" className="gap-2">
            📄 ดาวน์โหลดไฟล์ใบงานสรุปผลการทดลอง (.PDF)
          </Button>
        </section>

        {/* 3. ช่องทางการติดต่อผู้พัฒนา */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <User className="size-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              ข้อมูลผู้พัฒนาโครงการ (Developer Contacts)
            </h3>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <User className="size-4 text-primary" />
              <span>ผู้พัฒนา: พชร ดวงอุปะ (James) - ม.6/2</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <span className="text-xs font-semibold text-primary">โรงเรียน:</span>
              <span>
                หาดใหญ่วิทยาลัยสมบูรณ์กุลกัญญา (Hatyaiwittayalaisomboonkulkanya School)
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <Mail className="size-4 text-primary" />
              <span>อีเมลติดต่อ: phatchara@example.com</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <Phone className="size-4 text-primary" />
              <span>โทรศัพท์: 08x-xxx-xxxx</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
