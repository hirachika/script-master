<script lang="ts">
	import { LogOut, User, Settings, Menu } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	export let showUserMenu = true;
	// export let userName = "Study Buddy"; // ユーザー名非表示

	let isMenuOpen = false;
	let isMobileMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// function handleLogout() {
	// 	// ログアウト処理をここに記述
	// 	console.log("Logout clicked");
	// }
</script>

<header class="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<div class="flex items-center gap-2">
			<a href="/" class="flex items-center gap-2 group">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5555] text-white shadow-sm group-hover:rotate-3 transition-transform"
				>
					<span class="text-xl font-bold">S</span>
				</div>
				<span class="text-xl font-bold tracking-nomal text-red-500">Script Master</span>
			</a>
		</div>

		{#if showUserMenu}
			<div class="hidden md:flex md:items-center md:gap-6">
				<div class="relative">
					<p class="text-2 text-amber-700 font-bold tracking-nomal">
						⚠️ Data stored for 7 days locally
					</p>
					<!-- <button
						on:click={toggleMenu}
						class="flex items-center gap-3 rounded-full border border-gray-200 bg-white p-1 pr-3 shadow-sm hover:shadow-md transition-all active:scale-95"
					>
						<div class="h-8 w-8 rounded-full bg-gradient-to-tr from-[#FF5555] to-pink-400 flex items-center justify-center text-white text-xs font-bold">
							{userName.charAt(0)}
						</div>
						<span class="text-sm font-medium text-gray-700">{userName}</span>
					</button> -->

					{#if isMenuOpen}
						<div
							class="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white p-2 shadow-xl border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none"
							transition:slide={{ duration: 150 }}
						>
							<a
								href="/profile"
								class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
							>
								<User class="h-4 w-4" /> プロフィール
							</a>
							<a
								href="/settings"
								class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
							>
								<Settings class="h-4 w-4" /> 設定
							</a>
							<div class="my-1 border-t border-gray-100"></div>
							<!-- <button
								on:click={handleLogout}
								class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
								<LogOut class="h-4 w-4" /> ログアウト
							</button> -->
						</div>
					{/if}
				</div>
			</div>

			<!-- <div class="md:hidden">
				<button on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)} class="p-2 text-gray-600">
					<Menu class="h-6 w-6" />
				</button>
			</div> -->
		{/if}
	</div>

	{#if isMobileMenuOpen}
		<div class="md:hidden border-t border-gray-100 bg-white px-4 py-4" transition:slide>
			<div class="space-y-2">
				<a
					href="/profile"
					class="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
					>プロフィール</a
				>
				<a
					href="/settings"
					class="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
					>設定</a
				>
				<!-- <button
					on:click={handleLogout}
					class="block w-full text-left rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50">
					ログアウト
				</button> -->
			</div>
		</div>
	{/if}
</header>
