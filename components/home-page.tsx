"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

const slides = [
  { src: "/store-interior-reception.png", alt: "明亮温馨的宠物护理门店接待区", label: "查看接待区" },
  { src: "/store-interior-retail.png", alt: "整洁雅致的宠物用品陈列区", label: "查看用品陈列区" },
  { src: "/store-interior-grooming-lounge.png", alt: "舒适通透的宠物洗护与等候区", label: "查看洗护与等候区" },
];

function Hero({ openBooking }: { openBooking: () => void }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { reducedMotion.current = media.matches; };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion.current) return;
    const timer = window.setInterval(() => setActiveSlide((slide) => (slide + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div className="wrap hero">
      <div className="hero-card" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
        <div className="hero-slides" aria-live="polite">
          {slides.map((slide, index) => (
            <Image key={slide.src} className={`hero-slide${index === activeSlide ? " active" : ""}`} src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="(max-width: 820px) 100vw, 1180px" />
          ))}
        </div>
        <div className="hero-copy">
          <span className="eyebrow">Gentle pet grooming</span>
          <h1>洗去小烦恼，<em>毛孩子香香软软。</em></h1>
          <p className="lead">一宠一空间，全程可查看。我们用温和的手法和看得见的流程，让每一次洗护都安心又舒服。</p>
          <div className="actions"><button className="primary" onClick={openBooking}>预约洗护</button><a className="text-link" href="#services">看看服务与价格</a></div>
          <div className="trust"><span>独立消毒</span><span>低敏产品</span><span>全程反馈</span></div>
        </div>
        <div className="hero-dots" aria-label="门店环境轮播图">
          {slides.map((slide, index) => <button key={slide.src} className={`hero-dot${index === activeSlide ? " active" : ""}`} type="button" aria-label={slide.label} aria-current={index === activeSlide ? "true" : undefined} onClick={() => setActiveSlide(index)} />)}
        </div>
      </div>
    </div>
  );
}

function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const petInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.classList.toggle("lock", open);
    if (open) window.setTimeout(() => petInput.current?.focus(), 50);
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.classList.remove("lock"); document.removeEventListener("keydown", onKeyDown); };
  }, [open, onClose]);

  const close = () => { setSubmitted(false); onClose(); };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); event.currentTarget.reset(); setSubmitted(true); };

  if (!open) return null;
  return (
    <div className="modal open" role="dialog" aria-modal="true" aria-labelledby="dialogTitle" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="dialog"><button className="close" aria-label="关闭预约窗口" onClick={close}>×</button>
        {!submitted ? <div className="form-wrap"><h2 id="dialogTitle">预约洗护</h2><p>留下基础信息，我们会尽快与你确认。</p>
          <form onSubmit={submit}><label htmlFor="pet">宠物昵称</label><input ref={petInput} id="pet" required placeholder="例如：豆包" /><label htmlFor="type">宠物类型</label><select id="type" required defaultValue=""><option value="">请选择</option><option>狗狗</option><option>猫咪</option></select><label htmlFor="contact">联系人</label><input id="contact" aria-label="联系人" autoComplete="name" required placeholder="请输入联系人姓名" /><label htmlFor="phone">手机号</label><input id="phone" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+\- ]{7,20}" required placeholder="请输入手机号" /><label htmlFor="arrival">期望到店时间</label><input id="arrival" type="datetime-local" required /><button className="primary submit" type="submit">提交预约</button></form>
        </div> : <div className="success visible"><div className="big">🐾</div><h3>预约已收到</h3><p>我们会尽快联系你确认具体时间。</p><button className="primary done" onClick={close}>好的</button></div>}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const closeBooking = useCallback(() => setBookingOpen(false), []);
  return <>
    <header><div className="wrap nav"><a className="brand" href="#top" aria-label="爪爪日记首页"><span className="mark">🐾</span>爪爪日记</a><nav aria-label="主导航"><a href="#services">洗护项目</a><a href="#process">安心流程</a><a href="#about">关于我们</a><button className="nav-cta" onClick={() => setBookingOpen(true)}>现在预约</button></nav></div></header>
    <main id="top">
      <Hero openBooking={() => setBookingOpen(true)} />
      <section id="services"><div className="wrap services"><div className="section-head"><div><span className="eyebrow light">OUR SERVICES</span><h2>洗得干净，<br />也照顾小情绪。</h2></div><p>到店后先做皮毛与情绪评估，再根据体型、毛量和实际护理需求确认项目与价格。</p></div><div className="service-grid"><article className="service"><div className="icon">🛁</div><h3>基础净护</h3><p>洗澡、吹干、梳毛、剪甲、耳道与脚底清洁，适合日常定期护理。</p><div className="price">¥88 <small>起</small></div></article><article className="service"><div className="icon">✂️</div><h3>精致造型</h3><p>根据品种、毛质和生活习惯设计好打理的清爽造型。</p><div className="price">¥168 <small>起</small></div></article><article className="service"><div className="icon">🌿</div><h3>深层养护</h3><p>针对干燥、打结或换毛期，提供深层保湿与废毛管理。</p><div className="price">¥128 <small>起</small></div></article></div></div></section>
      <section id="process"><div className="wrap"><div className="section-head"><div><span className="eyebrow">CARE PROCESS</span><h2>每一步，都让你放心</h2></div><p>不赶时间、不做流水线。每只宠物都有自己的节奏，我们会及时同步状态。</p></div><div className="process-grid"><article className="step"><span className="num">STEP 01</span><h3>到店评估</h3><p>确认皮毛情况、健康注意事项与情绪状态。</p></article><article className="step"><span className="num">STEP 02</span><h3>专属方案</h3><p>透明确认项目、预计时长与最终价格。</p></article><article className="step"><span className="num">STEP 03</span><h3>温柔洗护</h3><p>一宠一工具，分区操作，全程耐心安抚。</p></article><article className="step"><span className="num">STEP 04</span><h3>护理反馈</h3><p>交付造型与护理建议，记录本次皮毛状态。</p></article></div></div></section>
      <section id="about"><div className="wrap promise"><blockquote className="quote"><p>“宠物不是来配合流程的，流程应该配合每一只宠物。”</p><footer>— 爪爪日记洗护师团队</footer></blockquote><div className="stats"><div className="stat"><strong>1对1</strong><span>专属洗护，不交叉等候</span></div><div className="stat"><strong>100%</strong><span>工具独立清洁消毒</span></div><div className="stat"><strong>3年+</strong><span>专业宠物洗护经验</span></div><div className="stat"><strong>随时</strong><span>同步状态与护理反馈</span></div></div></div></section>
      <section className="contact" id="contact"><div className="wrap contact-card"><div><h2>下一次洗护，交给我们吧。</h2><p>提交预约意向后，我们会与你确认到店时间、宠物情况与准确报价。</p><div className="hours"><span>营业时间 10:00–20:00</span><span>每周一店休</span></div></div><button className="primary" onClick={() => setBookingOpen(true)}>现在预约</button></div></section>
    </main>
    <footer className="wrap footer"><span>© 2026 爪爪日记宠物洗护</span><span>愿每只毛孩子，都被温柔对待。</span></footer>
    <BookingModal open={bookingOpen} onClose={closeBooking} />
  </>;
}
