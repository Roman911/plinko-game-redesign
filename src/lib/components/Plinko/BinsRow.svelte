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
<div class="flex h-6 w-full justify-center lg:h-8">
  {#if $plinkoEngine}
    <div class="flex gap-[1%]" style:width={`${($plinkoEngine.binsWidthPercentage ?? 0) * 100}%`}>
      {#each binPayouts[$rowCount][$riskLevel] as payout, binIndex}
        <div
          use:initAnimation
          class='flex min-w-0 flex-1 items-center justify-center bg-no-repeat bg-cover bg-center'
          style:background-image={binColorsByRowCount[$rowCount].background[binIndex]}
          style={`--my-color-var: ${binColorsByRowCount[$rowCount].background[binIndex]}`}
        >
        </div>
      {/each}
    </div>
  {/if}
</div>
