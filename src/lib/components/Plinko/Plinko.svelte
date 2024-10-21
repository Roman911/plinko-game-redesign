<script lang="ts">
  import { plinkoEngine } from '$lib/stores/game';
  import CircleNotch from 'phosphor-svelte/lib/CircleNotch';
  import type { Action } from 'svelte/action';
  import BinsRow from './BinsRow.svelte';
  import LastWins from './LastWins.svelte';
  import PlinkoEngine from './PlinkoEngine';

  const imgFly = new URL('$lib/assets/fly.png', import.meta.url).href

  const { WIDTH, HEIGHT } = PlinkoEngine;

  const initPlinko: Action<HTMLCanvasElement> = (node) => {
    $plinkoEngine = new PlinkoEngine(node);
    $plinkoEngine.start();

    return {
      destroy: () => {
        $plinkoEngine?.stop();
      },
    };
  };
</script>

<div class="relative mt-20">
  <div class="absolute left-1/2 transform -translate-x-1/2 top-0 z-10 pt-10">
    <div class="animate-bounce animate-infinite animate-duration-[3000ms]">
      <img class="w-32 animate-wiggle animate-infinite animate-duration-[2000ms]" src={ imgFly } alt="">
    </div>
  </div>

  <div class="mx-auto pt-12 flex h-full flex-col lg:px-4 pb-4" style:max-width={`${WIDTH}px`}>
    <div class="relative w-full" style:aspect-ratio={`${WIDTH} / ${HEIGHT}`}>
      {#if $plinkoEngine === null}
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <CircleNotch class="size-20 animate-spin text-slate-600" weight="bold" />
        </div>
      {/if}

      <canvas use:initPlinko width={WIDTH} height={HEIGHT} class="absolute inset-0 h-full w-full" />
    </div>
    <BinsRow />
  </div>
  <div class="absolute right-1 lg:right-0 top-24 -translate-y-1/2">
    <LastWins />
  </div>
</div>
