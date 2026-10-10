'use client'

import { useState } from 'react'
import { FlaskConical, Leaf, Shield, X, CheckCircle2 } from 'lucide-react'

export function SiteHeader() {
  const [activeModal, setActiveModal] = useState<'green' | 'micro' | null>(null)

  return (
    <>
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3.5 md:px-6">
          {/* ฝั่งซ้าย: โลโก้ + ชื่อหัวข้อ (เต็มความกว้างบนมือถือ ไม่ถูกบีบ) */}
          <div className="flex items-center gap-3.5 min-w-0 w-full md:w-auto md:flex-1">
            <div
              role="img"
              aria-label="ตราสัญลักษณ์โรงเรียน"
              className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background shadow-[0_0_4px_rgba(250,204,21,0.3)]"
            >
              <Shield className="size-6 sm:size-7 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-pretty text-xs sm:text-sm md:text-base font-semibold leading-snug text-primary">
                สื่อการเรียนรู้ห้องปฏิบัติการเสมือน (Virtual Lab) - โรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกันยา
              </p>
              <h1 className="text-pretty text-[11px] sm:text-xs md:text-sm leading-snug text-foreground mt-0.5">
                ชุดกระดาษทดสอบจำแนกความเข้มข้นของสารด้วยระยะทางการเคลื่อนที่บนกระดาษจากสารสกัดแก่นฝาง
              </h1>
            </div>
          </div>

          {/* ฝั่งขวา: ปุ่ม Green & Microscale Chemistry จัดเรียงสวยงามบนมือถือและเดสก์ท็อป */}
          <ul className="flex flex-row items-center justify-end gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80" aria-label="แนวคิดหลัก">
            <li>
              <button
                onClick={() => setActiveModal('green')}
                className="group flex flex-col items-center justify-center rounded-full border border-success/40 bg-success/10 px-3.5 py-1 text-[11px] sm:text-xs font-medium text-success transition-all hover:bg-success/20 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Leaf className="size-3.5" aria-hidden="true" />
                  Green Chemistry
                </span>
                <span className="text-[9px] sm:text-[10px] text-success/80 underline underline-offset-2 font-normal group-hover:text-success">
                  (คลิกอ่าน)
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveModal('micro')}
                className="group flex flex-col items-center justify-center rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-[11px] sm:text-xs font-medium text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span className="inline-flex items-center gap-1.5">
                  <FlaskConical className="size-3.5" aria-hidden="true" />
                  Microscale Chemistry
                </span>
                <span className="text-[9px] sm:text-[10px] text-primary/80 underline underline-offset-2 font-normal group-hover:text-primary">
                  (คลิกอ่าน)
                </span>
              </button>
            </li>
          </ul>
        </div>
      </header>

      {/* Modal: Green Chemistry (12 Principles) */}
      {activeModal === 'green' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-success/40 bg-slate-950 shadow-2xl text-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-3 text-success">
                <div className="p-2.5 rounded-xl bg-success/10 border border-success/30 shrink-0">
                  <Leaf className="size-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-white">Green Chemistry (เคมีสีเขียว)</h3>
                  <p className="text-xs sm:text-sm text-success/90 font-medium">หลักการ 12 ประการของเคมีสีเขียว (12 Principles of Green Chemistry)</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm text-slate-200 leading-relaxed">
              <p className="text-sm sm:text-base font-medium text-slate-100 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-success">เคมีสีเขียว (Green Chemistry)</strong> คือแนวทางการออกแบบผลิตภัณฑ์และกระบวนการทางเคมีเพื่อลดหรือกำจัดสารอันตราย โดยยึดหลักสำคัญ 12 ประการ ดังนี้:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">1. ป้องกันของเสีย (Prevention)</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">ออกแบบกระบวนการเพื่อป้องกันการเกิดของเสียตั้งแต่ต้นทาง ดีกว่าการกำจัดของเสียภายหลัง</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">2. เศรษฐกิจอะตอม (Atom Economy)</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">ออกแบบกระบวนการสังเคราะห์ให้เปลี่ยนสารตั้งต้นทุกอะตอมให้เป็นผลิตภัณฑ์ให้มากที่สุด</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">3. การสังเคราะห์สารอันตรายน้อยลง (Less Hazardous Syntheses)</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">ใช้วิธีการสังเคราะห์ที่ใช้และผลิตสารที่มีความเป็นพิษต่อมนุษย์และสิ่งแวดล้อมน้อยที่สุด</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">4. ออกแบบสารเคมีปลอดภัย (Designing Safer Chemicals)</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">ออกแบบผลิตภัณฑ์ให้ทำหน้าที่ได้ดีตามต้องการพร้อมทั้งมีความเป็นพิษต่ำ</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">5. ตัวทำละลายและตัวช่วยปลอดภัย (Safer Solvents & Auxiliaries)</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">หลีกเลี่ยงการใช้ตัวทำละลายหรือสารช่วยแยกสกัด หากจำเป็นต้องใช้ให้เลือกชนิดที่ไม่เป็นอันตราย</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">6. ออกแบบเพื่อการใช้พลังงานที่มีประสิทธิภาพ</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">คำนึงถึงพลังงานที่ใช้ ดำเนินการที่อุณหภูมิและความดันปกติ (Ambient conditions) เพื่อประหยัดพลังงาน</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">7. ใช้สารตั้งต้นจากธรรมชาติ (Renewable Feedstocks)</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">ใช้วัตถุดิบหรือสารตั้งต้นที่มาจากทรัพยากรเกษตรหรือธรรมชาติที่หมุนเวียนทดแทนได้ มากกว่าใช้ปิโตรเลียม</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">8. ลดอนุพันธ์ที่ไม่จำเป็น (Reduce Derivatives)</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">หลีกเลี่ยงการใช้กลุ่มคุ้มกัน (Blocking/protecting groups) หรือขั้นตอนอนุพันธ์ชั่วคราวเพื่อลดของเสีย</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">9. ใช้ตัวเร่งปฏิกิริยา (Catalysis)</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">ใช้รีเอเจนต์ตัวเร่งปฏิกิริยาที่มีประสิทธิภาพสูงในปริมาณน้อย ดีกว่าใช้สารทำปฏิกิริยาแบบใช้แล้วทิ้ง (Stoichiometric)</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">10. ออกแบบเพื่อการเสื่อมสลาย (Design for Degradation)</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">ออกแบบสารเคมีหลังใช้งานให้สลายตัวกลายเป็นผลิตภัณฑ์ที่ไม่เป็นพิษต่อสิ่งแวดล้อม ไม่สะสมในธรรมชาติ</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">11. วิเคราะห์แบบเรียลไทม์เพื่อป้องกันมลพิษ</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">พัฒนากรรมวิธีวิเคราะห์และติดตามกระบวนการแบบเรียลไทม์ เพื่อควบคุมและป้องกันการเกิดสารอันตรายระหว่างผลิต</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-success/30 transition-colors">
                  <span className="font-bold text-success text-sm sm:text-base block">12. เคมีปลอดภัยเพื่อป้องกันอุบัติเหตุ</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">เลือกใช้สารและรูปแบบสถานะทางกายภาพในกระบวนการ เพื่อลดความเสี่ยงต่ออุบัติเหตุ การระเบิด หรือเพลิงไหม้</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Microscale Chemistry */}
      {activeModal === 'micro' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-primary/40 bg-slate-950 shadow-2xl text-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-3 text-primary">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 shrink-0">
                  <FlaskConical className="size-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-white">Microscale Chemistry (เคมีแบบย่อส่วน)</h3>
                  <p className="text-xs sm:text-sm text-primary/90 font-medium">หลักการ แนวคิด และประโยชน์ของการย่อขนาดห้องปฏิบัติการ</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed">
              <p className="text-sm sm:text-base font-normal text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-primary font-semibold">เคมีแบบย่อส่วน (Microscale Chemistry)</strong> คือแนวคิดและเทคนิคในการทำปฏิบัติการทางเคมีโดยลดขนาดปริมาณสารเคมี อุปกรณ์ และเครื่องมือลงให้เหลือน้อยที่สุด (ระดับมิลลิลิตร หยด หรือไมโครลิตร) โดยยังคงให้ผลการทดลองที่ถูกต้องแม่นยำ
              </p>

              <div className="space-y-3.5">
                <div className="rounded-xl bg-slate-900/90 p-4 sm:p-5 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-primary text-sm sm:text-base flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-primary shrink-0" />
                    วัตถุประสงค์และจุดเด่นทั่วไปของเคมีแบบย่อส่วน
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 pl-5 list-disc leading-relaxed">
                    <li>
                      <strong className="text-white">ความปลอดภัยสูงสุด (Enhanced Safety):</strong> ลดความเสี่ยงจากอุบัติเหตุ การระเบิด หรือไอระเหยอันตราย เนื่องจากใช้สารเคมีปริมาณน้อยมาก
                    </li>
                    <li>
                      <strong className="text-white">ลดการเกิดของเสีย (Waste Minimization):</strong> ลดปริมาณขยะเคมีที่ปล่อยสู่สิ่งแวดล้อมได้อย่างมหาศาล ง่ายต่อการบำบัด
                    </li>
                    <li>
                      <strong className="text-white">ประหยัดงบประมาณ (Cost Efficiency):</strong> ลดต้นทุนค่าสารเคมีราคาสูงและเครื่องแก้วขนาดใหญ่
                    </li>
                    <li>
                      <strong className="text-white">เพิ่มความคล่องตัว (Portability):</strong> อุปกรณ์มีขนาดเล็ก น้ำหนักเบา สามารถนำไปจัดกิจกรรมนอกสถานที่หรือภาคสนามได้สะดวก
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl bg-slate-900/90 p-4 sm:p-5 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-primary text-sm sm:text-base flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-primary shrink-0" />
                    การประยุกต์ใช้ในระดับสากลและการศึกษา
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    ได้รับการยอมรับและส่งเสริมจากองค์กรการศึกษานานาชาติ (เช่น UNESCO และ IUPAC) เพื่อใช้ในการเรียนการสอนวิชาเคมี ช่วยให้นักเรียนฝึกฝนทักษะกระบวนการทางวิทยาศาสตร์ได้อย่างปลอดภัย สัมผัสประสบการณ์จริงได้ทั่วถึง และเป็นมิตรต่อสิ่งแวดล้อม
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
