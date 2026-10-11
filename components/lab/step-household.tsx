'use class'
'use client'

import { ArrowLeft, Beaker, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Notice, Panel, StepHeading } from './lab-ui'
import { cn } from '@/lib/utils'
import { mixHex } from '@/lib/lab' // เราต้องใช้ mixHex เพื่อทำให้สีดูสมจริง

const HOUSEHOLD_SAMPLES = [
  {
    id: 'vinegar',
    name: 'น้ำส้มสายชู (Vinegar)',
    type: 'กรดอ่อน',
    baseSetId: 'A', // เทียบเท่ากับ Set A (กระดาษสีแดงเคลือบเบส)
    basePaperColor: '#c8102e', // สีเริ่มต้นของกระดาษ Set A
    finalColor: '#f6b319', // สีสุดท้ายเมื่อเจอฤทธิ์กรด
    distance: 15,
    chemDesc: 'มีกรดแอซีติก (Acetic acid) เป็นองค์ประกอบ มีฤทธิ์เป็นกรดอ่อน ทำปฏิกิริยากับเบสที่เคลือบไว้บนกระดาษ ทำให้กระดาษสีแดงเปลี่ยนเป็นสีเหลือง'
  },
  {
    id: 'lime',
    name: 'น้ำมะนาว (Lime juice)',
    type: 'กรดอ่อน',
    baseSetId: 'A', // เทียบเท่ากับ Set A
    basePaperColor: '#c8102e', // สีเริ่มต้นของกระดาษ Set A
    finalColor: '#f59e0b', // สีสุดท้าย (โทนเหลืองส้ม)
    distance: 18,
    chemDesc: 'มีกรดซิตริก (Citric acid) มีฤทธิ์เป็นกรด ทำปฏิกิริยาสะเทินกับเบสบนกระดาษ ทำให้กระดาษสีแดงเปลี่ยนเป็นสีเหลือง-ส้ม'
  },
  {
    id: 'baking-soda',
    name: 'เบกกิ้งโซดา (Baking soda)',
    type: 'เบสอ่อน',
    baseSetId: 'B', // เทียบเท่ากับ Set B (กระดาษสีเหลืองเคลือบกรด)
    basePaperColor: '#f2c230', // สีเริ่มต้นของกระดาษ Set B
    finalColor: '#8e1b5b', // สีสุดท้ายเมื่อเจอฤทธิ์เบส
    distance: 28,
    chemDesc: 'มีฤทธิ์เป็นเบสอ่อน ทำปฏิกิริยากับกรดที่เคลือบไว้บนกระดาษ ทำให้กระดาษสีเหลืองเปลี่ยนเป็นสีแดง (โทนม่วงแดง)'
  },
  {
    id: 'soapy-water',
    name: 'น้ำสบู่ (Soapy water)',
    type: 'เบสอ่อน',
    baseSetId: 'B', // เทียบเท่ากับ Set B
    basePaperColor: '#f2c230', // สีเริ่มต้นของกระดาษ Set B
    finalColor: '#701a75', // สีสุดท้าย
    distance: 22,
