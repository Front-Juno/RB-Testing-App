import { resultCases } from "./resultCases";

const selectBtn = document.querySelectorAll("button");
const first = document.querySelector(".slide:nth-child(1)");
const lastImg = document.querySelector(".last img");

const selectNums = [];
const nextSlideEvent = (
  duration = 0,
  opacityDuration = 0,
  isSlide = false,
  event = null
) => {
  if (event) {
    const { id: parent } = event.target.parentNode.dataset;
    const { id: child } = event.target.dataset;
    if (parent) {
      selectNums.push(parent);
    } else if (child) {
      selectNums.push(child);
    }
  }
  // 매 함수 호출시마다 브라우저 width 길이를 업뎃함 -> 애니메이션 변수로 사용하기떄문
  const WINDOW = window.innerWidth;
  const PREV = "prev";
  const ACTIVE = "active";
  const NEXT = "next";
  const activeEl = document.getElementById(ACTIVE);
  const nextEl = document.getElementById(NEXT);
  const prevEl = document.getElementById(PREV);
  if (!activeEl) {
    first.id = ACTIVE;
    first.style.zIndex = 1;
    first.style.opacity = 1;
    first.style.pointerEvents = "initial";
    first.nextElementSibling.id = NEXT;
  } else {
    if (prevEl) {
      prevEl.removeAttribute("id");
    }
    activeEl.id = PREV;
    nextEl.id = ACTIVE;
    first.removeAttribute("style");
    activeEl.style.pointerEvents = "none";
    activeEl.animate(
      // 실행 시점에선 nextEl은 Prev 상태의 Element를 가리킴
      {
        transform: isSlide ? [`translateX(0)`, `translateX(-${WINDOW}px)`] : [],
        zIndex: [1, 1],
        opacity: [1, 0],
      },
      { duration: duration ? duration : 0, fill: "forwards" }
    );
    const loadingScreen = nextEl.className.includes("loading");
    nextEl.animate(
      // 실행 시점에선 nextEl은 현재 Active 상태의 Element를 가리킴
      {
        transform: isSlide ? [`translateX(${WINDOW}px)`, `translateX(0)`] : [],
        zIndex: [1, 2],
        opacity: [0, 1],
      },
      {
        duration: duration ? duration : 0,
        fill: "forwards",
        delay: loadingScreen ? opacityDuration + 1500 : opacityDuration,
      }
    );
    // select 버튼 이벤트 nesting 오류 fix
    setTimeout(
      () => (nextEl.style.pointerEvents = "initial"),
      opacityDuration + 500
    );

    if (!nextEl.nextElementSibling) {
      first.id = NEXT;
    } else {
      nextEl.nextElementSibling.id = NEXT;
    }

    // result image convert
    if (selectNums.length === 11) {
      resultCases(selectNums);
    }
  }
};

const init = () => {
  nextSlideEvent();
  selectBtn.forEach(
    (button) =>
      button.addEventListener("click", (event) =>
        nextSlideEvent(1000, 1800, false, event)
      ) // 애니메이션 속도, 딜레이시간, 슬라이드 온오프(기본 fasle)
  );
  // setInterval(() => nextSlideEvent(1000), 3500);
};

init();
