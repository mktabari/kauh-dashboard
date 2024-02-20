<script>
	import { Heading, P, List, Li, Tooltip, Kbd, Toast } from 'flowbite-svelte';
	// import { copy } from 'svelte-copy';
	// import { copy } from './copy.js';
	// import { copy } from '$lib/cards/ServerCard.svelte';
	import { v1 as uuid } from 'uuid';
	import { onMount } from 'svelte';
	let codeClass =
		'relative mx-4 mb-10 mt-4 rounded-md border border-gray-300 bg-gray-100 py-4 pl-4 text-gray-500';
	let id;
	let tocContentRef;
	onMount(() => {
		//toc create
		const allSections = document.querySelectorAll('section[id]');
		const ul = document.createElement('ul');
		allSections.forEach((section) => {
			const li = document.createElement('li');
			const a = document.createElement('a');
			a.href = `#${section.id}`;
			a.innerHTML = section.firstChild.innerHTML;
			li.classList.add(
				'text-lg',
				'py-1',
				'text-gray-500',
				'mb-2',
				'pl-4',
				'mr-16',
				'border-l-4',
				'border-transparent'
			);
			li.appendChild(a);
			ul.appendChild(li);
		});
		tocContentRef.appendChild(ul);

		//end toc create
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				id = entry.target.getAttribute('id');
				if (entry.intersectionRatio > 0) {
					document
						.querySelector(`li a[href="#${id}"]`)
						.parentElement.classList.remove('text-gray-500', 'border-transparent');
					document
						.querySelector(`li a[href="#${id}"]`)
						.parentElement.classList.add(
							'text-gray-800',
							'font-bold',
							'border-red-500',
							'bg-gray-100'
						);
				} else {
					document
						.querySelector(`li a[href="#${id}"]`)
						.parentElement.classList.remove(
							'text-gray-800',
							'font-bold',
							'border-red-500',
							'bg-gray-100'
						);
					document
						.querySelector(`li a[href="#${id}"]`)
						.parentElement.classList.add('text-gray-500', 'border-transparent');
				}
			});

			// Track all sections that have an `id` applied
		});
		document.querySelectorAll('section[id]').forEach((section) => {
			observer.observe(section);
		});
	});
	const copy = async (text) => {
		const element = document.createElement('TEXTAREA');
		const t = document.createTextNode(text);
		element.appendChild(t);
		element.style.setProperty('position', 'fixed');
		element.style.setProperty('z-index', '-100');
		element.style.setProperty('pointer-events', 'none');
		element.style.setProperty('opacity', '0');
		document.body.appendChild(element);
		element.focus();
		element.select();
		document.execCommand('copy');
		document.body.removeChild(element);
	};
	let toastShow = false;
	let toastCounter = 0;
	import { fly } from 'svelte/transition';
	const toastTrigger = () => {
		toastShow = true;
		toastCounter = 2;
		toastTimeout();
	};
	const toastTimeout = () => {
		if (--toastCounter > 0) return setTimeout(toastTimeout, 1000);
		toastShow = false;
	};
</script>

<Toast
	class="z-50"
	transition={fly}
	params={{ y: 200 }}
	color="red"
	position="bottom-right"
	bind:open={toastShow}
	divClass=" p-4 text-gray-800 bg-gray-200 shadow dark:text-gray-200 dark:bg-gray-900 gap-3 font-bold "
>
	Copied
</Toast>
<div class="flex flex-row">
	<div class=" px-16">
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-6">ERP</Heading>
			<P class="pb-4"
				>Connect with <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
					class="px-2 py-1 text-lg">ERP</Kbd
				> server using <Kbd class="px-2 py-1 text-lg">ssh</Kbd> then switch user to <Kbd
					class="px-2 py-1 text-lg">oraprod</Kbd
				> using <Kbd class="relative px-2 py-1 pr-5 text-lg"
					>su - oraprod <button
						id="strterpdb"
						on:click={() => {
							copy(`su - oraprod
`);
							toastTrigger();
						}}
						class=" absolute bottom-0"
					>
						<span class="material-symbols-outlined md-18 rotate-180 font-semibold opacity-50">
							content_copy
						</span></button
					>
					<!-- <Tooltip type="light" trigger="click" triggeredBy="#strterpdb">
						<span class="text-gray-800"> copied </span></Tooltip
					> -->
				</Kbd> and execute the following commands</P
			>
			<Heading tag="h6" class="mb-4 ml-4">Start ERP DB</Heading>
			<P
				class="relative mx-4 mb-8 mt-4 rounded-md border border-gray-300 bg-gray-100 py-4 pl-4 text-gray-500"
			>
				startup_db.sh<br />
				<button
					id="strterpdb"
					on:click={() => {
						copy(`startup_db.sh
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strterpdb">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Stop ERP DB</Heading>
			<P class={codeClass}
				>shutdown_db.sh<br />
				<button
					id="stperpdb"
					on:click={() => {
						copy(`shutdown_db.sh
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#stperpdb">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<P class="pb-4"
				>Connect with <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
					class="px-2 py-1 text-lg">ERP</Kbd
				> server using <Kbd class="px-2 py-1 text-lg">ssh</Kbd> then switch user to <Kbd
					class="px-2 py-1 text-lg">applprod</Kbd
				> using <Kbd class="relative px-2 py-1 pr-5 text-lg"
					>su - applprod <button
						id="strterpdb"
						on:click={() => {
							copy(`su - applprod
`);
							toastTrigger();
						}}
						class=" absolute bottom-0"
					>
						<span class="material-symbols-outlined md-18 rotate-180 font-semibold opacity-50">
							content_copy
						</span></button
					>
					<!-- <Tooltip type="light" trigger="click" triggeredBy="#strterpdb">
					<span class="text-gray-800"> copied </span></Tooltip
				> --></Kbd
				> and execute the following commands</P
			>
			<Heading tag="h6" class="mb-4 ml-4">Start ERP Application</Heading>
			<P class={codeClass}
				>startup_apps.sh<br />
				<button
					id="strterapp"
					on:click={() => {
						copy(`startup_apps.sh
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strterapp">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Stop ERP Application</Heading>
			<P class={codeClass}
				>shutdown_apps.sh.sh<br />
				<button
					id="stperpapp"
					on:click={() => {
						copy(`shutdown_apps.sh.sh
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#stperpapp">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-6">Medicom Database</Heading>
			<P class="pb-4"
				>Connect with <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
					class="px-2 py-1 text-lg">ERP</Kbd
				> server using <Kbd class="px-2 py-1 text-lg">ssh</Kbd> then switch user to <Kbd
					class="px-2 py-1 text-lg">oraprod</Kbd
				> using <Kbd class="relative px-2 py-1 pr-5 text-lg"
					>su - oraprod <button
						id="strterpdb"
						on:click={() => {
							copy(`su - applprod
`);
							toastTrigger();
						}}
						class=" absolute bottom-0"
					>
						<span class="material-symbols-outlined md-18 rotate-180 font-semibold opacity-50">
							content_copy
						</span></button
					>
					<!-- <Tooltip type="light" trigger="click" triggeredBy="#strterpdb">
				<span class="text-gray-800"> copied </span></Tooltip
			> --></Kbd
				> and execute the following commands, ERP DB listener should be started</P
			>
			<Heading tag="h6" class="mb-4 ml-4">Startup MEDICOM DB</Heading>
			<P class={codeClass}
				>. /u01/PROD/db/9.2.0/PROD_erp-srv.env<br />
				ORACLE_SID=mprod<br />
				export ORACLE_SID<br />
				sqlplus "/as sysdba"<br />
				startup pfile='/mprod/mprod_pfile.ora';<br />
				alter database open;<br />
				<button
					id="strtmed"
					on:click={() => {
						copy(`. /u01/PROD/db/9.2.0/PROD_erp-srv.env
ORACLE_SID=mprod
export ORACLE_SID
sqlplus "/as sysdba"
startup pfile='/mprod/mprod_pfile.ora';
alter database open;
exit
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strtmed">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Shutdown MEDICOM DB</Heading>
			<P class={codeClass}
				>. /u01/PROD/db/9.2.0/PROD_erp-srv.env<br />
				ORACLE_SID=mprod<br />
				export ORACLE_SID<br />
				sqlplus "/as sysdba"<br />
				shutdown immediate;<br />
				<button
					id="stpmed"
					on:click={() => {
						copy(`. /u01/PROD/db/9.2.0/PROD_erp-srv.env
ORACLE_SID=mprod
export ORACLE_SID
sqlplus "/as sysdba"
shutdown immediate;
exit
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#stpmed">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-6">Data Guard</Heading>
			<P class="pb-4"
				>Connect with <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
					class="px-2 py-1 text-lg">DR</Kbd
				> server using <Kbd class="px-2 py-1 text-lg">ssh</Kbd> then switch user to <Kbd
					class="px-2 py-1 text-lg">oracle</Kbd
				> using <Kbd class="relative px-2 py-1 pr-5 text-lg"
					>su - oracle <button
						id="strterpdb"
						on:click={() => {
							copy(`su - applprod
`);
							toastTrigger();
						}}
						class=" absolute bottom-0"
					>
						<span class="material-symbols-outlined md-18 rotate-180 font-semibold opacity-50">
							content_copy
						</span></button
					>
					<!-- <Tooltip type="light" trigger="click" triggeredBy="#strterpdb">
				<span class="text-gray-800"> copied </span></Tooltip
			> --></Kbd
				> and execute the following commands</P
			>
			<Heading tag="h6" class="mb-4 ml-4">Show status</Heading>
			<P class={codeClass}
				>dgmgrl /<br /> show configuration;<br /> show database isoftstby;
				<button
					id="strtdg"
					on:click={() => {
						copy(`dgmgrl /
show configuration;
show database isoftstby;
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strtdg">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Disable transport service of the primary database</Heading
			>
			<P class={codeClass}
				>dgmgrl /<br /> edit database 'isoft' set state='TRANSPORT-OFF';
				<br /> show database isoftstby;
				<button
					id="stptrans"
					on:click={() => {
						copy(`dgmgrl /
edit database 'isoft' set state='TRANSPORT-OFF';
show database isoftstby;
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#stptrans">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Enable transport service of the primary database</Heading>
			<P class={codeClass}
				>dgmgrl /<br /> edit database 'isoft' set state='TRANSPORT-ON';
				<br /> show database isoftstby;
				<button
					id="strttrans"
					on:click={() => {
						copy(`dgmgrl /
edit database 'isoft' set state='TRANSPORT-ON';
show database isoftstby;
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strttrans">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Disable apply service of the standby database</Heading>
			<P class={codeClass}
				>dgmgrl /<br /> edit database 'isoftstby' set state='APPLY-OFF';
				<br /> show database isoftstby;
				<button
					id="stpappl"
					on:click={() => {
						copy(`dgmgrl /
edit database 'isoftstby' set state='APPLY-OFF';
show database isoftstby;
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#stpappl">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Enable apply service of the standby database</Heading>
			<P class={codeClass}
				>dgmgrl /<br /> edit database 'isoftstby' set state='APPLY-ON';
				<br /> show database isoftstby;
				<button
					id="strtappl"
					on:click={() => {
						copy(`dgmgrl /
edit database 'isoftstby' set state='APPLY-ON';
show database isoftstby;
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strtappl">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Start disaster recovery database</Heading>
			<P class={codeClass}
				>sqlplus /as sysdba<br />startup nomount;<br /> alter database mount standby database;<br />
				alter database recover managed standby database disconnect from session;

				<button
					id="strtdg"
					on:click={() => {
						copy(`sqlplus /as sysdba
startup nomount;
alter database mount standby database;
alter database recover managed standby database disconnect from session;
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strtdg">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Stop disaster recovery database</Heading>
			<P class={codeClass}
				>sqlplus /as sysdba<br />alter database recover managed standby database cancel;<br />
				shutdown immediate;

				<button
					id="strtdg"
					on:click={() => {
						copy(`sqlplus /as sysdba
alter database recover managed standby database cancel;
shutdown immediate;
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strtdg">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-6">ILOM Net Management</Heading>
			<P class="pb-4"
				>Connect with the management <Kbd class="px-2 py-1 text-lg">root</Kbd> user to desired server
				using
				<Kbd class="px-2 py-1 text-lg">ssh</Kbd> and execute the following commands</P
			>
			<Heading tag="h6" class="mb-4 ml-4">Start server</Heading>
			<P class={codeClass}
				>start /SYS
				<button
					id="strts"
					on:click={() => {
						copy(`start /SYS
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strts">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Shutdown server</Heading>
			<P class={codeClass}
				>stop /SYS
				<button
					id="stps"
					on:click={() => {
						copy(`stop /SYS
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#stps">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Show console</Heading>
			<P class={codeClass}
				>start /HOST/console
				<button
					id="strtc"
					on:click={() => {
						copy(`start /HOST/console
`);
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strtc">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Show faults</Heading>
			<P class={codeClass}
				>show faulty
				<button
					id="strtc"
					on:click={() => {
						copy(`show faulty
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strtc">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-6">LDOM Management</Heading>
			<Heading tag="h6" class="mb-4 ml-4"
				>Transfering <Kbd class="px-2 py-1 text-lg">MIG</Kbd> lun from <Kbd
					class="px-2 py-1 text-lg">testisoft67</Kbd
				> to <Kbd class="px-2 py-1 text-lg">testisoft66</Kbd></Heading
			>
			<List tag="ol" class="ml-4">
				<Li>
					<span
						>Connect with the <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
							class="px-2 py-1 text-lg">ldm4</Kbd
						> on <Kbd class="px-2 py-1 text-lg">OVS4</Kbd> server using
						<Kbd class="px-2 py-1 text-lg">ssh</Kbd> and execute the following command</span
					>
					<P class={codeClass}
						>zpool export mig
						<button
							id="strts"
							on:click={() => {
								copy(`zpool export mig
`);
								toastTrigger();
							}}
							class=" absolute right-4 top-4"
						>
							<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
								content_copy
							</span></button
						>
						<!-- <Tooltip type="light" trigger="click" triggeredBy="#strts">
							<span class="text-gray-800"> copied </span></Tooltip
						> -->
					</P>
				</Li>
				<Li>
					<span
						>Connect with the <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
							class="px-2 py-1 text-lg">OVS4</Kbd
						> server using
						<Kbd class="px-2 py-1 text-lg">ssh</Kbd> and execute the following commands</span
					>
					<P class={codeClass}
						>ldm rm-vdisk mig ldm4<br /> ldm add-vdisk mig migration@primary-vds0 ldm1
						<button
							id="strts"
							on:click={() => {
								copy(`ldm rm-vdisk mig ldm4
ldm add-vdisk mig migration@primary-vds0 ldm1
`);
								toastTrigger();
							}}
							class=" absolute right-4 top-4"
						>
							<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
								content_copy
							</span></button
						>
						<!-- <Tooltip type="light" trigger="click" triggeredBy="#strts">
							<span class="text-gray-800"> copied </span></Tooltip
						> -->
					</P>
				</Li>
				<Li>
					<span
						>Connect with the <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
							class="px-2 py-1 text-lg">ldm1</Kbd
						> on <Kbd class="px-2 py-1 text-lg">OVS4</Kbd> server using
						<Kbd class="px-2 py-1 text-lg">ssh</Kbd> and execute the following command</span
					>
					<P class={codeClass}
						>zpool import mig
						<button
							id="strts"
							on:click={() => {
								copy(`zpool import mig
`);
								toastTrigger();
							}}
							class=" absolute right-4 top-4"
						>
							<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
								content_copy
							</span></button
						>
						<!-- <Tooltip type="light" trigger="click" triggeredBy="#strts">
							<span class="text-gray-800"> copied </span></Tooltip
						> -->
					</P></Li
				>
			</List>
			<Heading tag="h6" class="mb-4 ml-4"
				>Transfering <Kbd class="px-2 py-1 text-lg">MIG</Kbd> lun from <Kbd
					class="px-2 py-1 text-lg">testisoft66</Kbd
				> to <Kbd class="px-2 py-1 text-lg">testisoft67</Kbd></Heading
			>
			<List tag="ol" class="ml-4">
				<Li>
					<span
						>Connect with the <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
							class="px-2 py-1 text-lg">ldm1</Kbd
						> on <Kbd class="px-2 py-1 text-lg">OVS4</Kbd> server using
						<Kbd class="px-2 py-1 text-lg">ssh</Kbd> and execute the following command</span
					>
					<P class={codeClass}
						>zpool export mig
						<button
							id="strts"
							on:click={() => {
								copy(`zpool export mig
`);
								toastTrigger();
							}}
							class=" absolute right-4 top-4"
						>
							<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
								content_copy
							</span></button
						>
						<!-- <Tooltip type="light" trigger="click" triggeredBy="#strts">
							<span class="text-gray-800"> copied </span></Tooltip
						> -->
					</P>
				</Li>
				<Li>
					<span
						>Connect with the <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
							class="px-2 py-1 text-lg">OVS4</Kbd
						> server using
						<Kbd class="px-2 py-1 text-lg">ssh</Kbd> and execute the following commands</span
					>
					<P class={codeClass}
						>ldm rm-vdisk mig ldm1<br /> ldm add-vdisk mig migration@primary-vds0 ldm4
						<button
							id="strts"
							on:click={() => {
								copy(`ldm rm-vdisk mig ldm1
ldm add-vdisk mig migration@primary-vds0 ldm4
`);
								toastTrigger();
							}}
							class=" absolute right-4 top-4"
						>
							<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
								content_copy
							</span></button
						>
						<!-- <Tooltip type="light" trigger="click" triggeredBy="#strts">
							<span class="text-gray-800"> copied </span></Tooltip
						> -->
					</P>
				</Li>
				<Li>
					<span
						>Connect with the <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
							class="px-2 py-1 text-lg">ldm4</Kbd
						> on <Kbd class="px-2 py-1 text-lg">OVS4</Kbd> server using
						<Kbd class="px-2 py-1 text-lg">ssh</Kbd> and execute the following command</span
					>
					<P class={codeClass}
						>zpool import mig
						<button
							id="strts"
							on:click={() => {
								copy(`zpool import mig
`);
								toastTrigger();
							}}
							class=" absolute right-4 top-4"
						>
							<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
								content_copy
							</span></button
						>
						<!-- <Tooltip type="light" trigger="click" triggeredBy="#strts">
							<span class="text-gray-800"> copied </span></Tooltip
						> -->
					</P></Li
				>
			</List>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-4">Solaris Commands</Heading>
			<Heading tag="h6" class="mb-4 ml-6">Check Free Memory</Heading>
			<P class={codeClass}
				>echo "::memstat" | mdb -k
				<button
					id="strts"
					on:click={() => {
						copy(`echo "::memstat" | mdb -k
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strts">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			
			<Heading tag="h5" class="mb-4 mt-4">Diagnostics SQL</Heading
			>
			<Heading tag="h6" class="mb-4 ml-4">Block Changes</Heading>
			<P class={codeClass}
				><pre>SELECT s.sid, s.serial#, s.username, s.program,s.MACHINE,i.block_changes
FROM v$session s, v$sess_io i
WHERE s.sid = i.sid
ORDER BY 6 desc, 1, 2, 3, 4;</pre>
				<button
					id="strts"
					on:click={() => {
						copy(`SELECT s.sid, s.serial#, s.username, s.program,s.MACHINE,i.block_changes
FROM v$session s, v$sess_io i
WHERE s.sid = i.sid
ORDER BY 6 desc, 1, 2, 3, 4;
`);
						toastTrigger();
					}}
					class=" absolute right-4 top-4"
				>
					<span class="material-symbols-outlined md-24 rotate-180 font-semibold opacity-50">
						content_copy
					</span></button
				>
				<!-- <Tooltip type="light" trigger="click" triggeredBy="#strts">
					<span class="text-gray-800"> copied </span></Tooltip
				> -->
			</P>
		</section>
	</div>
	<div class="w-1/2">
		<div id="toc" class=" sticky top-0 pl-10" bind:this={tocContentRef}>
			<Heading tag="h5" class="  mb-6 mt-4  pb-2"><span class="">ON THIS PAGE</span></Heading>
		</div>
	</div>
</div>
