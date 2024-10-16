<script lang="ts">
  import { binColorsByRowCount, binPayouts } from '$lib/constants/game';
  import { plinkoEngine, riskLevel, rowCount, winRecords } from '$lib/stores/game';
  import { isAnimationOn } from '$lib/stores/settings';
  import type { Action } from 'svelte/action';

  /**
   * Bounce animations for each bin, which is played when a ball falls into the bin.
   */
  let binAnimations: Animation[] = [];

  $: {
    if ($winRecords.length) {
      const lastWinBinIndex = $winRecords[$winRecords.length - 1].binIndex;
      playAnimation(lastWinBinIndex);
    }
  }

  const initAnimation: Action<HTMLDivElement> = (node) => {
    const bounceAnimation = node.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(30%)' },
        { transform: 'translateY(0)' },
      ],
      {
        duration: 300,
        easing: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      },
    );
    bounceAnimation.pause(); // Don't run the animation immediately
    binAnimations.push(bounceAnimation);
  };

  function playAnimation(binIndex: number) {
    if (!$isAnimationOn) {
      return;
    }

    const animation = binAnimations[binIndex];

    // Always reset animation before playing. Safari has a weird behavior where
    // the animation will not play the second time if it's not cancelled.
    animation.cancel();

    animation.play();
  }
</script>

<!-- Height clamping in mobile: From 10px at 370px viewport width to 16px at 600px viewport width -->
<div class="flex h-[clamp(10px,0.352px+2.609vw,16px)] w-full justify-center lg:h-7">
  {#if $plinkoEngine}
    <div class="flex gap-[1%]" style:width={`${($plinkoEngine.binsWidthPercentage ?? 0) * 100}%`}>
      {#each binPayouts[$rowCount][$riskLevel] as payout, binIndex}
        <!-- Font-size clamping:
              - Mobile (< 1024px): From 6px at 370px viewport width to 8px at 600px viewport width
              - Desktop (>= 1024px): From 10px at 1024px viewport width to 12px at 1100px viewport width
         -->
        <div
          use:initAnimation
          class='relative flex min-w-0 flex-1 items-center justify-center rounded-sm text-[clamp(6px,2.784px+0.87vw,8px)]
          font-bold text-white shadow-[0_2px_var(--shadow-color)] lg:rounded-md lg:text-[clamp(10px,-16.944px+2.632vw,12px)] lg:shadow-[0_3px_var(--shadow-color)]
          before:absolute before:-top-2 before:left-0 before:w-[58%] before:h-full before:rounded-md before:bg-[var(--my-color-var)] before:transform before:skew-y-6 before:-z-10
          after:absolute after:-top-2 after:right-0 after:w-[58%] after:h-full after:rounded-md after:bg-[var(--my-color-var)] after:transform after:-skew-y-6 after:-z-10'
          style:background-color={binColorsByRowCount[$rowCount].background[binIndex]}
          style={`--my-color-var: ${binColorsByRowCount[$rowCount].background[binIndex]}`}
        >
          {payout}
        </div>
      {/each}
    </div>
  {/if}
</div>
