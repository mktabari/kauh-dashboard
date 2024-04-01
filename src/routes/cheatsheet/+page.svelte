<script>
	import { Heading, P, List, Li, Tooltip, Kbd, Toast } from 'flowbite-svelte';
	import Copy from '$lib/component/Copy.svelte';
	import { v1 as uuid } from 'uuid';
	import { onMount } from 'svelte';
	let codeClass =
		'relative mx-4 mb-10 mt-4 rounded-md border border-gray-300 bg-gray-100 py-4 pl-4 text-gray-500 dark:border-gray-600 dark:bg-gray-700';
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
							'bg-gray-100',
							'dark:bg-gray-700',
							'dark:text-gray-400'
						);
				} else {
					document
						.querySelector(`li a[href="#${id}"]`)
						.parentElement.classList.remove(
							'text-gray-800',
							'font-bold',
							'border-red-500',
							'bg-gray-100',
							'dark:bg-gray-700',
							'dark:text-gray-400'
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
</script>

<div class="flex flex-row">
	<div class=" px-16">
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-6">ERP</Heading>
			<P class="pb-4"
				>Connect with <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
					class="px-2 py-1 text-lg">ERP</Kbd
				> server using <Kbd class="px-2 py-1 text-lg">ssh</Kbd> then switch user to <Kbd
					class="px-2 py-1 text-lg">oraprod</Kbd
				> using <Kbd class="relative px-2 py-1  text-lg"
					>su - oraprod <Copy
						value="su - oraprod
"
					/>
				</Kbd> and execute the following commands</P
			>
			<Heading tag="h6" class="mb-4 ml-4">Start ERP DB</Heading>
			<P
				class="relative mx-4 mb-8 mt-4 rounded-md border border-gray-300 bg-gray-100 py-4 pl-4 text-gray-500 dark:border-gray-600 dark:bg-gray-700"
			>
				startup_db.sh<br />
				<div class=" absolute right-4 top-4">
					<Copy
						value="startup_db.sh
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Stop ERP DB</Heading>
			<P class={codeClass}
				>shutdown_db.sh<br />
				<div class=" absolute right-4 top-4">
					<Copy
						value="shutdown_db.sh
"
					/>
				</div>
			</P>
			<P class="pb-4"
				>Connect with <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
					class="px-2 py-1 text-lg">ERP</Kbd
				> server using <Kbd class="px-2 py-1 text-lg">ssh</Kbd> then switch user to <Kbd
					class="px-2 py-1 text-lg">applprod</Kbd
				> using <Kbd class="relative px-2 py-1 text-lg"
					>su - applprod <Copy
						value="su - applprod
"
					/>
				</Kbd> and execute the following commands</P
			>
			<Heading tag="h6" class="mb-4 ml-4">Start ERP Application</Heading>
			<P class={codeClass}
				>startup_apps.sh<br />
				<div class=" absolute right-4 top-4">
					<Copy
						value="startup_apps.sh
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Stop ERP Application</Heading>
			<P class={codeClass}
				>shutdown_apps.sh.sh<br />
				<div class=" absolute right-4 top-4">
					<Copy
						value="shutdown_apps.sh
"
					/>
				</div>
			</P>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-6">Medicom Database</Heading>
			<P class="pb-4"
				>Connect with <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
					class="px-2 py-1 text-lg">ERP</Kbd
				> server using <Kbd class="px-2 py-1 text-lg">ssh</Kbd> then switch user to <Kbd
					class="px-2 py-1 text-lg">oraprod</Kbd
				> using <Kbd class="relative px-2 py-1 text-lg"
					>su - oraprod <Copy
						value="su - oraprod
"
					/></Kbd
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
				<div class=" absolute right-4 top-4">
					<Copy
						value=". /u01/PROD/db/9.2.0/PROD_erp-srv.env
ORACLE_SID=mprod
export ORACLE_SID
sqlplus '/as sysdba'
startup pfile='/mprod/mprod_pfile.ora';
alter database open;
exit
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Shutdown MEDICOM DB</Heading>
			<P class={codeClass}
				>. /u01/PROD/db/9.2.0/PROD_erp-srv.env<br />
				ORACLE_SID=mprod<br />
				export ORACLE_SID<br />
				sqlplus "/as sysdba"<br />
				shutdown immediate;<br />
				<div class=" absolute right-4 top-4">
					<Copy
						value=". /u01/PROD/db/9.2.0/PROD_erp-srv.env
ORACLE_SID=mprod
export ORACLE_SID
sqlplus '/as sysdba'
shutdown immediate;
exit
"
					/>
				</div>
			</P>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-6">Data Guard</Heading>
			<P class="pb-4"
				>Connect with <Kbd class="px-2 py-1 text-lg">root</Kbd> user to <Kbd
					class="px-2 py-1 text-lg">DR</Kbd
				> server using <Kbd class="px-2 py-1 text-lg">ssh</Kbd> then switch user to <Kbd
					class="px-2 py-1 text-lg">oracle</Kbd
				> using <Kbd class="relative px-2 py-1 text-lg"
					>su - oracle <Copy
						value="su - oracle
"
					/></Kbd
				> and execute the following commands</P
			>
			<Heading tag="h6" class="mb-4 ml-4">Show status</Heading>
			<P class={codeClass}
				>dgmgrl /<br /> show configuration;<br /> show database isoftstby;
				<div class=" absolute right-4 top-4">
					<Copy
						value="dgmgrl /
show configuration;
show database isoftstby;
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Disable transport service of the primary database</Heading
			>
			<P class={codeClass}
				>dgmgrl /<br /> edit database 'isoft' set state='TRANSPORT-OFF';
				<br /> show database isoftstby;
				<div class=" absolute right-4 top-4">
					<Copy
						value="dgmgrl /
edit database 'isoft' set state='TRANSPORT-OFF';
show database isoftstby;
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Enable transport service of the primary database</Heading>
			<P class={codeClass}
				>dgmgrl /<br /> edit database 'isoft' set state='TRANSPORT-ON';
				<br /> show database isoftstby;
				<div class=" absolute right-4 top-4">
					<Copy
						value="dgmgrl /
edit database 'isoft' set state='TRANSPORT-ON';
show database isoftstby;
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Disable apply service of the standby database</Heading>
			<P class={codeClass}
				>dgmgrl /<br /> edit database 'isoftstby' set state='APPLY-OFF';
				<br /> show database isoftstby;
				<div class=" absolute right-4 top-4">
					<Copy
						value="dgmgrl /
edit database 'isoftstby' set state='APPLY-OFF';
show database isoftstby;
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Enable apply service of the standby database</Heading>
			<P class={codeClass}
				>dgmgrl /<br /> edit database 'isoftstby' set state='APPLY-ON';
				<br /> show database isoftstby;
				<div class=" absolute right-4 top-4">
					<Copy
						value="dgmgrl /
edit database 'isoftstby' set state='APPLY-ON';
show database isoftstby;
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Start disaster recovery database</Heading>
			<P class={codeClass}
				>sqlplus /as sysdba<br />startup nomount;<br /> alter database mount standby database;<br />
				alter database recover managed standby database disconnect from session;
				<div class=" absolute right-4 top-4">
					<Copy
						value="sqlplus /as sysdba
startup nomount;
alter database mount standby database;
alter database recover managed standby database disconnect from session;
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Stop disaster recovery database</Heading>
			<P class={codeClass}
				>sqlplus /as sysdba<br />alter database recover managed standby database cancel;<br />
				shutdown immediate;
				<div class=" absolute right-4 top-4">
					<Copy
						value="sqlplus /as sysdba
alter database recover managed standby database cancel;
shutdown immediate;
"
					/>
				</div>
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
				<div class=" absolute right-4 top-4">
					<Copy
						value="start /SYS
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Shutdown server</Heading>
			<P class={codeClass}
				>stop /SYS
				<div class=" absolute right-4 top-4">
					<Copy
						value="stop /SYS
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Show console</Heading>
			<P class={codeClass}
				>start /HOST/console
				<div class=" absolute right-4 top-4">
					<Copy
						value="start /HOST/console
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-4">Show faults</Heading>
			<P class={codeClass}
				>show faulty
				<div class=" absolute right-4 top-4">
					<Copy
						value="show faulty
"
					/>
				</div>
			</P>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-6">LDOM Management</Heading>
			<Heading tag="h6" class="mb-4 ml-4"
				>Transfering <Kbd class="px-2 py-1 text-lg">MIG</Kbd> lun from <Kbd
					class="px-2 py-1 text-lg">testisoft67</Kbd
				> to <Kbd class="px-2 py-1 text-lg">testisoft66</Kbd></Heading
			><P>
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
							<div class=" absolute right-4 top-4">
								<Copy
									value="zpool export mig
			"
								/>
							</div>
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
							<div class=" absolute right-4 top-4">
								<Copy
									value="ldm rm-vdisk mig ldm4
ldm add-vdisk mig migration@primary-vds0 ldm1
"
								/>
							</div>
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
							<div class=" absolute right-4 top-4">
								<Copy
									value="zpool import mig
"
								/>
							</div>
						</P>
					</Li>
				</List></P
			>
			<Heading tag="h6" class="mb-4 ml-4"
				>Transfering <Kbd class="px-2 py-1 text-lg">MIG</Kbd> lun from <Kbd
					class="px-2 py-1 text-lg">testisoft66</Kbd
				> to <Kbd class="px-2 py-1 text-lg">testisoft67</Kbd></Heading
			>
			<P>
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
							<div class=" absolute right-4 top-4">
								<Copy
									value="zpool export mig
"
								/>
							</div>
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
							<div class=" absolute right-4 top-4">
								<Copy
									value="ldm rm-vdisk mig ldm1
ldm add-vdisk mig migration@primary-vds0 ldm4
"
								/>
							</div>
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
							<div class=" absolute right-4 top-4">
								<Copy
									value="zpool import mig
"
								/>
							</div>
						</P>
					</Li>
				</List></P
			>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-4">Solaris Commands</Heading>
			<Heading tag="h6" class="mb-4 ml-6">Check Free Memory</Heading>
			<P class={codeClass}
				>echo "::memstat" | mdb -k
				<div class=" absolute right-4 top-4">
					<Copy
						value="echo '::memstat' | mdb -k
"
					/>
				</div>
			</P>
			<Heading tag="h6" class="mb-4 ml-6">Check Network</Heading>
			<P class={codeClass}
				>dladm show-phys
				<div class=" absolute right-4 top-4">
					<Copy
						value="dladm show-phys
"
					/>
				</div>
			</P>
			<P class={codeClass}
				>ipadm show-if
				<div class=" absolute right-4 top-4">
					<Copy
						value="ipadm show-if
"
					/>
				</div>
			</P>
			<P class={codeClass}
				>ipadm show-addr
				<div class=" absolute right-4 top-4">
					<Copy
						value="ipadm show-addr
"
					/>
				</div>
			</P>
		</section>
		<section id={uuid()} class="scroll-mt-14">
			<Heading tag="h5" class="mb-4 mt-4">Diagnostics SQL</Heading>
			<Heading tag="h6" class="mb-4 ml-4">Block Changes</Heading>
			<P class={codeClass}
				><pre>SELECT s.sid, s.serial#, s.username, s.program,s.MACHINE,i.block_changes
FROM v$session s, v$sess_io i
WHERE s.sid = i.sid
ORDER BY 6 desc, 1, 2, 3, 4;</pre>
				<div class=" absolute right-4 top-4">
					<Copy
						value="SELECT s.sid, s.serial#, s.username, s.program,s.MACHINE,i.block_changes
FROM v$session s, v$sess_io i
WHERE s.sid = i.sid
ORDER BY 6 desc, 1, 2, 3, 4;
"
					/>
				</div>
			</P>
		</section>
	</div>
	<div class="w-1/2">
		<div id="toc" class=" sticky top-0 pl-10" bind:this={tocContentRef}>
			<Heading tag="h5" class="  mb-6 mt-4  pb-2"><span class="">ON THIS PAGE</span></Heading>
		</div>
	</div>
</div>
