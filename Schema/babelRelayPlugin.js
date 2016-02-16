const getBabelRelayPlugin = require('babel-relay-plugin');
const schema = require('/devel/exponent/oss/react-conf-2016-server/lib/schema.json');

module.exports = getBabelRelayPlugin(schema.data);
