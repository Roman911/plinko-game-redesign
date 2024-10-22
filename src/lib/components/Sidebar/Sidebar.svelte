<script lang="ts">
  import { onMount } from 'svelte';
  import Marquee from 'svelte-fast-marquee';
  import { autoBetIntervalMs } from '$lib/constants/game';
  import {
    balance,
    betAmount, numberGame,
    plinkoEngine, winRecords,
  } from '$lib/stores/game';
  import { BetMode } from '$lib/types';
  import { twMerge } from 'tailwind-merge';

  import boll from '$lib/assets/boll.png';
  import bollOff from '$lib/assets/boll-off.png';

  import sound from '$lib/assets/gamestart.mp3';

  $: geoCity = undefined;

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

  $: a = 0;

  $: if($numberGame === 1 && $winRecords.length === 1) {
    setTimeout(() => {
      isDropBallDisabled = false;
    }, 500);
  }

  function handleBetClick() {
    isDropBallDisabled = true;
    let song = new Audio(sound);
    song.volume = 0.8;
    song.play();
    if (betMode === BetMode.MANUAL) {
      $plinkoEngine?.dropBall();
    } else if (autoBetInterval === null) {
      autoBetsLeft = autoBetInput === 0 ? null : autoBetInput;
      autoBetInterval = setInterval(autoBetDropBall, autoBetIntervalMs);
    } else if (autoBetInterval !== null) {
      resetAutoBetInterval();
    }

    $numberGame = $numberGame + 1;
    setTimeout(() => {
      a=a+1;
    }, 700);
  }
</script>

<div class="flex flex-col gap-2 p-3 lg:max-w-80 mx-auto">
  <h3 class="text-white uppercase text-center font-bold">balls:</h3>
  <div class="flex w-40 mx-auto mb-4 gap-1 border border-[#CBE0EC] rounded-lg py-1.5 px-1.5">
    <div class="relative w-full h-6">
      <img class="w-full h-full" src={ bollOff } alt="">
      <img class={ twMerge('w-full h-6 absolute top-0 left-0 animate-once',$numberGame === 2 && 'animate-ping' ) } src={ a > 1 ? bollOff : boll } alt="">
    </div>
    <div class="relative w-full h-6">
      <img class="w-full h-full" src={ bollOff } alt="">
      <img class={ twMerge('w-full h-6 absolute top-0 left-0 animate-once',$numberGame === 1 && 'animate-ping' ) } src={ a > 0 ? bollOff : boll } alt="">
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
      <p class="whitespace-pre">
        A player Sho*** from { geoCity || 'your city' } won <span class="font-bold text-[#FFE875]"> €250 </span>              A player Dem** from { geoCity || 'your city' } won <span class="font-bold text-[#FFE875]">€150</span>
      </p>
    </Marquee>
  </div>
</div>

<style>
  .box {
    @apply px-5 mt-10 text-white;
    mask-image: linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent 100%);
  }
</style>
