'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Award, FileText, Mail, Phone, User, ArrowLeft, CheckCircle2, Facebook } from 'lucide-react'

type StepCompletionProps = {
  onBack: () => void
}

export function StepCompletion({ onBack }: StepCompletionProps) {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lab_certificate_data')
        if (saved) {
          const parsed = JSON.parse(saved)
          setFormData(parsed)
          setIsSubmitted(true)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.school.trim()) {
      setIsSubmitted(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('lab_certificate_data', JSON.stringify(formData))
      }
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 md:px-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="size-4" /> กลับสู่หน้าแล็บ
          </Button>
          <h1 className="text-xl font-bold text-foreground">🎉 หน้าสรุปผลและจบหลักสูตร Virtual Lab</h1>
        </div>

        {/* ฟอร์มกรอกข้อมูล / เกียรติบัตร */}
        {!isSubmitted ? (
          <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <Award className="size-6 text-amber-500" />
              <h3 className="text-lg font-semibold text-foreground">กรอกข้อมูลเพื่อรับเกียรติบัตรผ่านการอบรม</h3>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              กรุณากรอกชื่อ-นามสกุล และชื่อสถานศึกษาของท่านให้ถูกต้อง เพื่อแสดงลงบนเกียรติบัตร (ข้อมูลจะถูกบันทึกและล็อคไว้หลังกดยืนยัน)
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">ชื่อ - นามสกุล (สำหรับแสดงบนเกียรติบัตร)</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="เช่น นายพชร ดวงอุปะ"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">โรงเรียน / สถาบันการศึกษา</label>
                <input
                  type="text"
                  name="school"
                  required
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="เช่น โรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกัญญา"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 text-white hover:bg-amber-700">
                ยืนยันข้อมูลและสร้างเกียรติบัตร
              </Button>
            </form>
          </section>
        ) : (
          <section className="relative overflow-hidden rounded-2xl border-4 border-amber-500/40 bg-card p-8 text-center shadow-2xl md:p-12">
            <div className="absolute right-4 top-4 rounded-full bg-amber-500/10 p-3">
              <Award className="size-10 text-amber-500" />
            </div>

            <div className="mb-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500">
              <CheckCircle2 className="size-4" /> Certificate of Completion
            </div>

            <h2 className="text-2xl font-serif font-bold text-foreground md:text-3xl">ใบประกาศนียบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า</h2>
            
            <div className="my-6">
              <p className="text-3xl font-bold tracking-wide text-primary underline decoration-amber-500/50 underline-offset-8 md:text-4xl">
                {formData.name}
              </p>
            </div>

            <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
              ได้ผ่านการทดลองและปฏิบัติการเสมือนจริง (Virtual Lab) เรื่อง <strong className="text-foreground">ชุดกระดาษทดสอบจำแนกความเข้มข้นของสารด้วยระยะทางการเคลื่อนที่บนกระดาษจากสารสกัดแก่นฝาง</strong> สำเร็จลุล่วงตามหลักสูตร
            </p>

            <div className="my-6 inline-block rounded-xl border border-amber-500/30 bg-amber-500/5 px-6 py-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">สถาบัน / โครงการพัฒนา:</p>
              <p className="text-sm font-bold text-foreground">{formData.school}</p>
            </div>
          </section>
        )}

        {/* ส่วนที่ 3: เอกสารใบงาน (Worksheet) */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="size-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">เอกสารใบงานการทดลอง (Worksheet & Reports)</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">ดาวน์โหลดสรุปผลการทดลอง ระยะการเคลื่อนที่ และกราฟความเข้มข้นเพื่อใช้ประกอบรายงาน</p>
          
          <a
            href="/worksheet.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Worksheet-VirtualLab.pdf"
          >
            <Button variant="outline" className="gap-2 cursor-pointer">
              📄 ดาวน์โหลดไฟล์ใบงานสรุปผลการทดลอง (.PDF)
            </Button>
          </a>
        </section>

        {/* ส่วนที่ 4: ข้อมูลผู้พัฒนา */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
          <div className="mb-4 flex items-center gap-3">
