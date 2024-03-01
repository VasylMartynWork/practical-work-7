module.exports = function(RED) {
    function PW7Node(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.topic = config.topic;
        
        this.inputKey = config.input_key || "payload"; // where to take the input from
		this.outputKey = config.output_key || "payload";
		this.cases = config.cases;
        
        node.on('input', function(msg) {
            const { payload } = msg;

			const value =
				node.inputKey && payload.hasOwnProperty(node.inputKey)
				? payload[node.inputKey]
				: payload;
				
			let formattedValue = value;
			
			if(node.cases == "uppercase"){
				formattedValue = value.toUpperCase();
			}
			else if(node.cases == "snakecase"){
				formattedValue =  value.charAt(0).toLowerCase() + value.slice(1)
					.replace(/\W+/g, " ") 
					.replace(/([a-z])([A-Z])([a-z])/g, "$1 $2$3") 
					.split(/\B(?=[A-Z]{2,})/) 
					.join(' ')
					.split(' ') 
					.join('_') 
					.toLowerCase() 
			}
			else if(node.cases == "camelcase"){
				formattedValue = value.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
						return index == 0 ? word.toLowerCase() : word.toUpperCase();
				}).replace(/\s+/g, '');
			}
				
			const resolvedKey = node.outputKey || node.inputKey;

			if (typeof msg.payload == "object") {
				msg.payload[resolvedKey] = formattedValue;
			} else {
				msg.payload = formattedValue;
			}
			node.send(msg);
        });
    }
    RED.nodes.registerType("pw7",PW7Node);
}
