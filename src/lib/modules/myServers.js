import { wrightConfig, readConfig, removeConfig } from './myFs.js';
import { v4 as uuid } from 'uuid';
import { allServers } from '../config/env.js';

const getServers = () => {
	return readConfig(allServers);
};
const getServer = (id) => {
	const myServers = getServers();
	const myServer = myServers.find((server) => server.id === id);
	return myServer;
};
const addServer = (server) => {
	const myServers = getServers();
	let id = uuid();
	if (!myServers) {
		wrightConfig(allServers, [{ id, ...server }]);
		wrightConfig(id, { id, ...server });
	} else if (!myServers.find((myServer) => myServer.name === server.name)) {
		wrightConfig(allServers, [...myServers, { id, ...server }]);
		wrightConfig(id, { id, ...server });
	} else console.log('Server with same name exists!');
};
const updateServer = (server) => {
	let myServers = getServers().filter((myServer) => myServer.id !== server.id);
	wrightConfig(allServers, [...myServers, server]);
	wrightConfig(server.id, server);
};
const removeServer = (server) => {
	wrightConfig(allServers, [...getServers().filter((myServer) => myServer.id !== server.id)]);
	removeConfig(server.id);
};
const setServerConfig = (serverId, serverData) => {
	wrightConfig(serverId, serverData);
};
const getServerConfig = (serverId) => {
	return readConfig(serverId);
};
const getTagServers = (tagValue) => {
	let servers = getServers();
	let tagServers = servers.filter(
		(server) =>
			!!server.tags.find((tag) => {
				return tag.name === tagValue && tag.done === true;
			})
	);

	return tagServers;
};
export {
	getServers,
	getServer,
	addServer,
	updateServer,
	removeServer,
	setServerConfig,
	getServerConfig,
	getTagServers
};
