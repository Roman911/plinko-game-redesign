<script lang="ts">
  import LiveStatsWindow from '$lib/components/LiveStatsWindow/LiveStatsWindow.svelte';
  import Plinko from '$lib/components/Plinko';
  import SettingsWindow from '$lib/components/SettingsWindow';
  import Sidebar from '$lib/components/Sidebar';
  import Modal from '$lib/components/Modal';
  import ModalSound from '$lib/components/ModalSound';
  import { setBalanceFromLocalStorage, writeBalanceToLocalStorage } from '$lib/utils/game';
  import { onMount } from 'svelte';

  onMount(() => {
    setBalanceFromLocalStorage();
  });
</script>

<svelte:window on:beforeunload={writeBalanceToLocalStorage} />

<div class="relative flex min-h-dvh w-full flex-col">
  <div class="flex-1 lg:px-5">
    <div class="mx-auto min-w-[300px] max-w-xl drop-shadow-xl md:mt-10 lg:max-w-7xl">
      <div class="overflow-hidden rounded-lg w-full min-h-screen">
        <Plinko />
        <Sidebar />
      </div>
    </div>
  </div>

  <SettingsWindow />
  <LiveStatsWindow />
  <Modal />
  <ModalSound />
</div>

<style>
  :global(body) {
    @apply bg-gray-800 bg-center bg-cover;
    background-image: url("/src/lib/assets/bg_body.png");

    @media only screen and (max-width: 1024px) {
      background-image: url("/src/lib/assets/bg_body_mob.png");
    }
  }
</style>
