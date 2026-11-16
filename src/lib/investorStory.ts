export type InvestorStory = {
  hero: {
    sublabel: string
    lines: string[]
    meta: string
    stats: { value: string; label: string }[]
  }
  sections: {
    id: string
    label: string
    heading: string
    intro?: string
    cards?: { title: string; body: string }[]
    stats?: { value: number; prefix?: string; suffix?: string; decimals?: number; label: string }[]
    projection?: { year: string; revenue: number; ebitda: string }[]
    note?: string
  }[]
}
