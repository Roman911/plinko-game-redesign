<script lang="ts">
  import { onMount } from 'svelte';
  import Marquee from 'svelte-fast-marquee';
  import { autoBetIntervalMs } from '$lib/constants/game';
  import {
    balance,
    betAmount,
    plinkoEngine,
  } from '$lib/stores/game';
  import { BetMode } from '$lib/types';
  import { twMerge } from 'tailwind-merge';

  import boll from '$lib/assets/boll.png';
  import bollOff from '$lib/assets/boll-off.png';
  import modalArt from '$lib/assets/modal-art.png'

  $: geoCity = undefined;
  $: modalOpen = false;

  onMount(() => {
    fetch('https://geo.sppopups.com/')
      .then( body => body.json() )
      .then( value => {
        geoCity = value.city || undefined;
      });
  });

  let betMode: BetMode = BetMode.MANUAL;

  /**
   * When `betMode` is `AUTO`, the number of bets to be placed. Zero means infinite bets.
   */
  let autoBetInput = 0;

  /**
   * Number of auto bets remaining when `betMode` is `AUTO`.
   *
   * - `number`: Finite count of how many bets left. It decrements from `autoBetInput` to 0.
   * - `null`: For infinite bets (i.e. `autoBetInput` is 0).
   */
  let autoBetsLeft: number | null = null;

  let autoBetInterval: ReturnType<typeof setInterval> | null = null;

  $: isBetAmountNegative = $betAmount < 0;
  $: isBetExceedBalance = $betAmount > $balance;
  $: isAutoBetInputNegative = autoBetInput < 0;

  $: isDropBallDisabled =
    $plinkoEngine === null || isBetAmountNegative || isBetExceedBalance || isAutoBetInputNegative;

  function resetAutoBetInterval() {
    if (autoBetInterval !== null) {
      clearInterval(autoBetInterval);
      autoBetInterval = null;
    }
  }

  function autoBetDropBall() {
    if (isBetExceedBalance) {
      resetAutoBetInterval();
      return;
    }

    // Infinite mode
    if (autoBetsLeft === null) {
      $plinkoEngine?.dropBall();
      return;
    }

    // Finite mode
    if (autoBetsLeft > 0) {
      $plinkoEngine?.dropBall();
      autoBetsLeft -= 1;
    }
    if (autoBetsLeft === 0 && autoBetInterval !== null) {
      resetAutoBetInterval();
      return;
    }
  }

  $: i = 0;
  $: a = 0;

  function handleBetClick() {
    isDropBallDisabled = true;
    if (betMode === BetMode.MANUAL) {
      $plinkoEngine?.dropBall();
    } else if (autoBetInterval === null) {
      autoBetsLeft = autoBetInput === 0 ? null : autoBetInput;
      autoBetInterval = setInterval(autoBetDropBall, autoBetIntervalMs);
    } else if (autoBetInterval !== null) {
      resetAutoBetInterval();
    }

    i=i+1;
    setTimeout(() => {
      a=a+1;
    }, 700);

    if(i === 1) {
      setTimeout(() => {
        isDropBallDisabled = false;
      }, 5700);
    }

    if(i === 2) {
      setTimeout(() => {
        modalOpen = true;
      }, 6300);
    }
  }
</script>

<div class="flex flex-col gap-2 p-3 lg:max-w-80 mx-auto">
  <h3 class="text-white uppercase text-center font-bold">balls:</h3>
  <div class="flex w-40 mx-auto mb-4 gap-1 border border-[#CBE0EC] rounded-lg py-1.5 px-1.5">
    <div class="relative w-full h-6">
      <img class="w-full h-full" src={ bollOff } alt="">
      <img class={ twMerge('w-full h-6 absolute top-0 left-0 animate-once',i === 2 && 'animate-ping' ) } src={ a > 1 ? bollOff : boll } alt="">
    </div>
    <div class="relative w-full h-6">
      <img class="w-full h-full" src={ bollOff } alt="">
      <img class={ twMerge('w-full h-6 absolute top-0 left-0 animate-once',i === 1 && 'animate-ping' ) } src={ a > 0 ? bollOff : boll } alt="">
    </div>
    <img class="w-full h-6" src={ bollOff } alt="">
    <img class="w-full h-6" src={ bollOff } alt="">
    <img class="w-full h-6" src={ bollOff } alt="">
    <img class="w-full h-6" src={ bollOff } alt="">
  </div>

  <button
    on:click={handleBetClick}
    disabled={isDropBallDisabled}
    class={twMerge(
      'w-40 mx-auto touch-manipulation rounded-md h-16 py-3 text-lg font-bold text-slate-900 uppercase transition hover:bg-green-400 active:bg-green-600 disabled:bg-neutral-600 disabled:text-neutral-400',
      autoBetInterval !== null && 'bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600',
    )}
    style:background={isDropBallDisabled ? '' : "linear-gradient(180deg, #F8D918 0%, #FF9D02 100%)"}
  >
    {#if betMode === BetMode.MANUAL}
      Drop Ball
    {:else if autoBetInterval === null}
      Start Autobet
    {:else}
      Stop Autobet
    {/if}
  </button>

  <div class="box">
    <Marquee pauseOnClick={ true } direction='left' speed={40} play={ true } >
      <p>
        A player Sho*** from { geoCity || 'your city' } won
        <span class="font-bold text-[#FFE875]"> €250 </span>
        A player Dem** from { geoCity || 'your city' } won
        <span class="font-bold text-[#FFE875]">€150</span>
      </p>
    </Marquee>
  </div>
</div>

<!-- Background overlay -->
<div class={twMerge('hidden fixed inset-0 transition top-0 left-0 right-0 bottom-0 z-10 h-screen', modalOpen && 'block')}>
  <div class="absolute inset-0 bg-[#001335] opacity-75"></div>
</div>
<!-- Modal -->
<div class={twMerge('fixed z-10 inset-0 overflow-y-auto', !modalOpen && 'hidden opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', modalOpen && 'block transition ease-out duration-300 transform opacity-100 translate-y-0 sm:scale-100')}>
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <!-- Modal panel -->
    <div class="w-full inline-block bg-[#DDEBFF] align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
      <div
        class="text-center p-2 font-bold"
        style:background="linear-gradient(180deg, #F8D918 0%, #FF9D02 100%)"
      >
        CONGRATULATIONS!
      </div>
      <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <!-- Modal content -->
        <img class="block mx-auto mb-4" src={ modalArt } alt="">
        <p class="text-[#262626] text-[13px] font-bold text-center">
          To continue playing game register on website
        </p>
      </div>
      <div class="px-4 pb-6 text-center">
        <!-- Subscribe button -->
        <button type="button" class="sign-up">
          sing up
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .box {
    @apply px-5 mt-10 text-white;
    mask-image: linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent 100%);
  }

  .sign-up {
    @apply rounded-md border px-6 py-2.5 font-bold uppercase;
    background: linear-gradient(180deg, #F8D918 0%, #FF9D02 100%);
  }
</style>
