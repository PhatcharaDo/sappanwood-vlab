'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Award, FileText, Mail, Phone, User, ArrowLeft, CheckCircle2, Gift, Loader2 } from 'lucide-react'

type StepCompletionProps = {
  onBack: () => void
}

export function StepCompletion({ onBack }: StepCompletionProps) {
  const [formData, setFormData] = useState({
    name: '',
    contactType1: 'IG',
    contactValue1: '',
    contactType2: 'Facebook',
    contactValue2: '',
    school: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('lab_certificate_session')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.name && parsed.school) {
            setFormData(parsed)
            setIsSubmitted(true)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.school.trim() || !formData.contactValue1.trim()) {
      alert('กรุณากรอกชื่อ ช่องทางติดต่อที่ 1 และโรงเรียน/สถาบันการศึกษาให้ครบถ้วน')
      return
    }

    setIsSubmitting(true)

    try {
      // สามารถเพิ่มโค้ดส่งข้อมูลไปกูเกิ้ลชีต หรือ Supabase ได้ที่นี่ ตัวอย่างเช่น:
      /*
      await fetch('/api/submit-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      */

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lab_certificate_session', JSON.stringify(formData))
      }
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
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

        {/* ฟอร์มกรอกข้อมูลสำหรับสุ่มรับรางวัล / รับเกียรติบัตร */}
        {!isSubmitted ? (
          <section className="rounded-2xl border border-amber-500/30 bg-card p-6 shadow-lg relative overflow-hidden">
            <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-500">
                <Gift className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">กรอกข้อมูลสำหรับสุ่มรับรางวัล & รับเกียรติบัตร</h3>
                <p className="text-xs text-muted-foreground">
                  กรุณากรอกข้อมูลให้ถูกต้อง เพื่อใช้สำหรับสุ่มแจกของรางวัลและแสดงชื่อลงบนเกียรติบัตร
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ชื่อ - นามสกุล */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  ชื่อ - นามสกุล <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="เช่น นายพชร ดวงอุปะ"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* ช่องทางติดต่อสะดวก 1 */}
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">
                    ช่องทางติดต่อสะดวก 1 <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="contactType1"
                    value={formData.contactType1}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                  >
                    <option value="IG">Instagram (IG)</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Line">Line ID</option>
                    <option value="Phone">เบอร์โทรศัพท์</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">
                    ชื่อบัญชี / ID / เบอร์โทรศัพท์ <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactValue1"
                    required
                    value={formData.contactValue1}
                    onChange={handleChange}
                    placeholder="เช่น @p_.pxztt หรือ Phatchara Dounguapa"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* ช่องทางติดต่อสะดวก 2 (สำรอง) */}
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    ช่องทางติดต่อสะดวก 2 (สำรอง)
                  </label>
                  <select
                    name="contactType2"
                    value={formData.contactType2}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="IG">Instagram (IG)</option>
                    <option value="Line">Line ID</option>
                    <option value="Phone">เบอร์โทรศัพท์</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    ชื่อบัญชี / ID / เบอร์โทรศัพท์ (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    name="contactValue2"
                    value={formData.contactValue2}
                    onChange={handleChange}
                    placeholder="เช่น 099-302-1693"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* โรงเรียน / สถาบันการศึกษา */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  โรงเรียน / สถาบันการศึกษา <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="school"
                  required
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="เช่น โรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกันยา"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 text-white hover:bg-amber-700 py-3 font-bold gap-2 text-base shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> กำลังบันทึกข้อมูล...
                  </>
                ) : (
                  <>
                    <Gift className="size-5" /> ยืนยันข้อมูลสุ่มรับรางวัล & รับเกียรติบัตร
                  </>
                )}
              </Button>
            </form>
          </section>
        ) : (
          /* แสดงเกียรติบัตรหลังจากลงทะเบียนสำเร็จ */
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
              ได้ผ่านการทดลองและปฏิบัติการเสมือนจริง (Virtual Lab) เรื่อง{' '}
              <strong className="text-foreground">
                ชุดกระดาษทดสอบจำแนกความเข้มข้นของสารด้วยระยะทางการเคลื่อนที่บนกระดาษจากสารสกัดแก่นฝาง
              </strong>{' '}
              สำเร็จลุล่วงตามหลักสูตร
            </p>

            <div className="my-6 inline-block rounded-xl border border-amber-500/30 bg-amber-500/5 px-6 py-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">สถาบัน / โครงการพัฒนา:</p>
              <p className="text-sm font-bold text-foreground">{formData.school}</p>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              ✨ ลงทะเบียนร่วมสุ่มรับของรางวัลเรียบร้อยแล้ว (ช่องทางติดต่อ: {formData.contactType1}: {formData.contactValue1})
            </div>
          </section>
        )}

        {/* ส่วนที่ 3: เอกสารใบงาน (Worksheet) */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="size-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">เอกสารใบงานการทดลอง (Worksheet & Reports)</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">ดาวน์โหลดเอกสารเพื่อใช้ประกอบการทำรายงาน</p>

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
            <User className="size-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">ข้อมูลผู้พัฒนาโครงการ (Developer Contacts)</h3>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <User className="size-4 text-primary" />
              <span>ผู้พัฒนา: พชร ดวงอุปะ (เพชร) - ม.6/2</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <span className="text-xs font-semibold text-primary">โรงเรียน:</span>
              <span>หาดใหญ่วิทยาลัยสมบูรณ์กุลกันยา (Hatyaiwittayalaisomboonkulkanya School)</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <Mail className="size-4 text-primary" />
              <span>อีเมลติดต่อ: petcchyy9@gmail.com</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <Phone className="size-4 text-primary" />
              <span>โทรศัพท์: 099-302-1693</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <span>Facebook: Phatchara Dounguapa</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>Instagram: @p_.pxztt</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
