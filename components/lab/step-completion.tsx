// ... (โค้ดก่อนหน้า)

          // บรรทัดที่ 147 เริ่มต้นที่นี่
          <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              {/* ส่วนข้อมูลผู้พัฒนาโครงการ (Developer Contacts) */}
              <User className="size-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                ข้อมูลผู้พัฒนาโครงการ (Developer Contacts)
              </h3>
            </div> {/* <-- ปิด div ของบรรทัด 148 ที่นี่ */}
            
            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                <User className="size-4 text-primary" />
                <span>ผู้พัฒนา: พชร ดวงอุปะ (James) - ม.6/2</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                <span className="text-xs font-semibold text-primary">โรงเรียน:</span>
                <span>หาดใหญ่วิทยาลัยสมบูรณ์กุลกัญญา (Hatyaiwittayalaisomboonkulkanya School)</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                <Mail className="size-4 text-primary" />
                <span>อีเมลติดต่อ: phatchara@example.com</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                <Phone className="size-4 text-primary" />
                <span>โทรศัพท์: 08x-xxx-xxxx</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                <Facebook className="size-4 text-primary" />
                <span>Facebook: Phatchara Dounguapa</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                {/* ใช้ SVG ของ Instagram แทน lucide-react (จากโค้ดที่คุณเคยให้มา) */}
                <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>Instagram: @james_phatchara</span>
              </div>
            </div>

          </section> {/* <-- ปิด section ของบรรทัด 147 ที่นี่ */}
        </main> {/* <-- ปิด main tag ที่เปิดไว้ก่อนหน้า */}
      </div> {/* <-- ปิด main div tag ของคอมโพเนนต์ที่เปิดไว้ก่อนหน้า */}
    ); // <-- ปิด return (
    }; // <-- ปิด function StepCompletion {
