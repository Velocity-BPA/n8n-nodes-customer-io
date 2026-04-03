/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-customerio/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Customerio implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Customer.io',
    name: 'customerio',
    icon: 'file:customerio.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Customer.io API',
    defaults: {
      name: 'Customer.io',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'customerioApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Customer',
            value: 'customer',
          },
          {
            name: 'Event',
            value: 'event',
          },
          {
            name: 'Campaign',
            value: 'campaign',
          },
          {
            name: 'Message',
            value: 'message',
          },
          {
            name: 'Segment',
            value: 'segment',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          }
        ],
        default: 'customer',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['customer'] } },
	options: [
		{ name: 'Get Customer', value: 'getCustomer', description: 'Get customer profile by ID', action: 'Get a customer' },
		{ name: 'Update Customer', value: 'updateCustomer', description: 'Update customer attributes', action: 'Update a customer' },
		{ name: 'Delete Customer', value: 'deleteCustomer', description: 'Delete a customer profile', action: 'Delete a customer' },
		{ name: 'Set Customer Attributes', value: 'setCustomerAttributes', description: 'Set custom attributes for customer', action: 'Set customer attributes' },
		{ name: 'Get All Customers', value: 'getAllCustomers', description: 'List customers with filtering', action: 'Get all customers' }
	],
	default: 'getCustomer',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['event'] } },
  options: [
    { name: 'Track Event', value: 'trackEvent', description: 'Track a custom event for a customer', action: 'Track a custom event for a customer' },
    { name: 'Get Customer Events', value: 'getCustomerEvents', description: 'Get events for a specific customer', action: 'Get events for a specific customer' },
    { name: 'Get All Events', value: 'getAllEvents', description: 'Get events across all customers', action: 'Get events across all customers' }
  ],
  default: 'trackEvent',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['campaign'] } },
	options: [
		{
			name: 'Get All Campaigns',
			value: 'getAllCampaigns',
			description: 'List all campaigns',
			action: 'Get all campaigns',
		},
		{
			name: 'Get Campaign',
			value: 'getCampaign',
			description: 'Get campaign details',
			action: 'Get campaign details',
		},
		{
			name: 'Get Campaign Metrics',
			value: 'getCampaignMetrics',
			description: 'Get campaign performance metrics',
			action: 'Get campaign metrics',
		},
		{
			name: 'Start Campaign',
			value: 'startCampaign',
			description: 'Start a campaign',
			action: 'Start campaign',
		},
		{
			name: 'Stop Campaign',
			value: 'stopCampaign',
			description: 'Stop a campaign',
			action: 'Stop campaign',
		},
	],
	default: 'getAllCampaigns',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['message'],
		},
	},
	options: [
		{
			name: 'Send Transactional Email',
			value: 'sendTransactionalEmail',
			description: 'Send a transactional email to a customer',
			action: 'Send transactional email',
		},
		{
			name: 'Get Message',
			value: 'getMessage',
			description: 'Get message delivery status by message ID',
			action: 'Get message',
		},
		{
			name: 'Get All Messages',
			value: 'getAllMessages',
			description: 'List sent messages with optional filters',
			action: 'Get all messages',
		},
		{
			name: 'Send Push Notification',
			value: 'sendPushNotification',
			description: 'Send a push notification to a customer',
			action: 'Send push notification',
		},
	],
	default: 'sendTransactionalEmail',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['segment'],
		},
	},
	options: [
		{
			name: 'Get All Segments',
			value: 'getAllSegments',
			description: 'List all segments',
			action: 'Get all segments',
		},
		{
			name: 'Create Segment',
			value: 'createSegment',
			description: 'Create a new customer segment',
			action: 'Create a segment',
		},
		{
			name: 'Get Segment',
			value: 'getSegment',
			description: 'Get segment details',
			action: 'Get a segment',
		},
		{
			name: 'Update Segment',
			value: 'updateSegment',
			description: 'Update segment conditions',
			action: 'Update a segment',
		},
		{
			name: 'Delete Segment',
			value: 'deleteSegment',
			description: 'Delete a segment',
			action: 'Delete a segment',
		},
		{
			name: 'Get Segment Customers',
			value: 'getSegmentCustomers',
			description: 'Get customers in a segment',
			action: 'Get segment customers',
		},
	],
	default: 'getAllSegments',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
		},
	},
	options: [
		{
			name: 'Get All Webhooks',
			value: 'getAllWebhooks',
			description: 'List all configured webhooks',
			action: 'Get all webhooks',
		},
		{
			name: 'Create Webhook',
			value: 'createWebhook',
			description: 'Create a new webhook endpoint',
			action: 'Create a webhook',
		},
		{
			name: 'Get Webhook',
			value: 'getWebhook',
			description: 'Get webhook configuration by ID',
			action: 'Get a webhook',
		},
		{
			name: 'Update Webhook',
			value: 'updateWebhook',
			description: 'Update webhook settings',
			action: 'Update a webhook',
		},
		{
			name: 'Delete Webhook',
			value: 'deleteWebhook',
			description: 'Remove a webhook',
			action: 'Delete a webhook',
		},
	],
	default: 'getAllWebhooks',
},
{
	displayName: 'Customer ID',
	name: 'customerId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['customer'],
			operation: ['getCustomer', 'updateCustomer', 'deleteCustomer', 'setCustomerAttributes']
		}
	},
	default: '',
	description: 'The ID of the customer'
},
{
	displayName: 'Attributes',
	name: 'attributes',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true
	},
	displayOptions: {
		show: {
			resource: ['customer'],
			operation: ['updateCustomer', 'setCustomerAttributes']
		}
	},
	default: {},
	options: [
		{
			name: 'attribute',
			displayName: 'Attribute',
			values: [
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
					description: 'Attribute name'
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					description: 'Attribute value'
				}
			]
		}
	],
	description: 'Customer attributes to set or update'
},
{
	displayName: 'Start',
	name: 'start',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['customer'],
			operation: ['getAllCustomers']
		}
	},
	default: '',
	description: 'Start cursor for pagination'
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['customer'],
			operation: ['getAllCustomers']
		}
	},
	default: 50,
	description: 'Maximum number of customers to return'
},
{
	displayName: 'Filter',
	name: 'filter',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['customer'],
			operation: ['getAllCustomers']
		}
	},
	default: '',
	description: 'Filter expression for customers'
},
{
  displayName: 'Customer ID',
  name: 'customerId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['event'], operation: ['trackEvent', 'getCustomerEvents'] } },
  default: '',
  description: 'The unique identifier for the customer'
},
{
  displayName: 'Event Name',
  name: 'eventName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['event'], operation: ['trackEvent'] } },
  default: '',
  description: 'The name of the event to track'
},
{
  displayName: 'Event Data',
  name: 'eventData',
  type: 'json',
  required: false,
  displayOptions: { show: { resource: ['event'], operation: ['trackEvent'] } },
  default: '{}',
  description: 'Additional data associated with the event'
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['event'], operation: ['trackEvent'] } },
  default: 0,
  description: 'Unix timestamp when the event occurred (defaults to current time)'
},
{
  displayName: 'Start Time',
  name: 'start',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['event'], operation: ['getCustomerEvents', 'getAllEvents'] } },
  default: 0,
  description: 'Unix timestamp for the start of the time range'
},
{
  displayName: 'End Time',
  name: 'end',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['event'], operation: ['getCustomerEvents', 'getAllEvents'] } },
  default: 0,
  description: 'Unix timestamp for the end of the time range'
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['event'], operation: ['getCustomerEvents', 'getAllEvents'] } },
  default: 100,
  description: 'Maximum number of events to return'
},
{
  displayName: 'Event Type',
  name: 'type',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['event'], operation: ['getAllEvents'] } },
  default: '',
  description: 'Filter events by type'
},
{
	displayName: 'Campaign ID',
	name: 'campaignId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['campaign'],
			operation: ['getCampaign', 'getCampaignMetrics', 'startCampaign', 'stopCampaign'],
		},
	},
	default: '',
	description: 'The ID of the campaign',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['campaign'],
			operation: ['getAllCampaigns'],
		},
	},
	default: 50,
	description: 'Maximum number of campaigns to return',
},
{
	displayName: 'Start',
	name: 'start',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['campaign'],
			operation: ['getAllCampaigns'],
		},
	},
	default: '',
	description: 'Cursor for pagination',
},
{
	displayName: 'To',
	name: 'to',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendTransactionalEmail'],
		},
	},
	default: '',
	description: 'Email address of the recipient',
},
{
	displayName: 'Subject',
	name: 'subject',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendTransactionalEmail'],
		},
	},
	default: '',
	description: 'Subject line for the email',
},
{
	displayName: 'Body',
	name: 'body',
	type: 'string',
	typeOptions: {
		rows: 5,
	},
	required: true,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendTransactionalEmail'],
		},
	},
	default: '',
	description: 'HTML or plain text body of the email',
},
{
	displayName: 'Identifiers',
	name: 'identifiers',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: false,
	},
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendTransactionalEmail'],
		},
	},
	default: {},
	placeholder: 'Add Identifier',
	options: [
		{
			name: 'identifierProperties',
			displayName: 'Identifier',
			values: [
				{
					displayName: 'ID',
					name: 'id',
					type: 'string',
					default: '',
					description: 'Customer ID',
				},
				{
					displayName: 'Email',
					name: 'email',
					type: 'string',
					default: '',
					description: 'Customer email',
				},
			],
		},
	],
	description: 'Customer identifiers',
},
{
	displayName: 'Message Data',
	name: 'message_data',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendTransactionalEmail'],
		},
	},
	default: '{}',
	description: 'Additional data to include in the message',
},
{
	displayName: 'Message ID',
	name: 'message_id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['getMessage'],
		},
	},
	default: '',
	description: 'Unique identifier of the message',
},
{
	displayName: 'Start Time',
	name: 'start',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['getAllMessages'],
		},
	},
	default: '',
	description: 'Unix timestamp for the start of the time range',
},
{
	displayName: 'End Time',
	name: 'end',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['getAllMessages'],
		},
	},
	default: '',
	description: 'Unix timestamp for the end of the time range',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	typeOptions: {
		minValue: 1,
		maxValue: 1000,
	},
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['getAllMessages'],
		},
	},
	default: 100,
	description: 'Maximum number of messages to return',
},
{
	displayName: 'Message Type',
	name: 'type',
	type: 'options',
	options: [
		{
			name: 'Email',
			value: 'email',
		},
		{
			name: 'Push',
			value: 'push',
		},
		{
			name: 'SMS',
			value: 'sms',
		},
		{
			name: 'Webhook',
			value: 'webhook',
		},
	],
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['getAllMessages'],
		},
	},
	default: '',
	description: 'Filter messages by type',
},
{
	displayName: 'To',
	name: 'to',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendPushNotification'],
		},
	},
	default: '',
	description: 'Customer identifier for the push notification recipient',
},
{
	displayName: 'Identifiers',
	name: 'identifiers',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: false,
	},
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendPushNotification'],
		},
	},
	default: {},
	placeholder: 'Add Identifier',
	options: [
		{
			name: 'identifierProperties',
			displayName: 'Identifier',
			values: [
				{
					displayName: 'ID',
					name: 'id',
					type: 'string',
					default: '',
					description: 'Customer ID',
				},
				{
					displayName: 'Email',
					name: 'email',
					type: 'string',
					default: '',
					description: 'Customer email',
				},
			],
		},
	],
	description: 'Customer identifiers',
},
{
	displayName: 'Message Data',
	name: 'message_data',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['sendPushNotification'],
		},
	},
	default: '{}',
	description: 'Push notification content and additional data',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['getAllSegments', 'getSegmentCustomers'],
		},
	},
	default: 50,
	description: 'Maximum number of records to return',
},
{
	displayName: 'Start',
	name: 'start',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['getAllSegments', 'getSegmentCustomers'],
		},
	},
	default: '',
	description: 'Starting cursor for pagination',
},
{
	displayName: 'Segment Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['createSegment', 'updateSegment'],
		},
	},
	default: '',
	description: 'Name of the segment',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['createSegment', 'updateSegment'],
		},
	},
	default: '',
	description: 'Description of the segment',
},
{
	displayName: 'Conditions',
	name: 'conditions',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['createSegment', 'updateSegment'],
		},
	},
	default: '{}',
	description: 'Segment conditions in JSON format',
},
{
	displayName: 'Segment ID',
	name: 'segmentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['getSegment', 'updateSegment', 'deleteSegment', 'getSegmentCustomers'],
		},
	},
	default: '',
	description: 'The segment ID',
},
{
	displayName: 'Webhook ID',
	name: 'webhookId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['getWebhook', 'updateWebhook', 'deleteWebhook'],
		},
	},
	default: '',
	description: 'The ID of the webhook',
},
{
	displayName: 'URL',
	name: 'url',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook', 'updateWebhook'],
		},
	},
	default: '',
	description: 'The URL endpoint for the webhook',
},
{
	displayName: 'Events',
	name: 'events',
	type: 'multiOptions',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook', 'updateWebhook'],
		},
	},
	options: [
		{
			name: 'Email Sent',
			value: 'email_sent',
		},
		{
			name: 'Email Opened',
			value: 'email_opened',
		},
		{
			name: 'Email Clicked',
			value: 'email_clicked',
		},
		{
			name: 'Email Bounced',
			value: 'email_bounced',
		},
		{
			name: 'Email Delivered',
			value: 'email_delivered',
		},
		{
			name: 'Customer Subscribed',
			value: 'customer_subscribed',
		},
		{
			name: 'Customer Unsubscribed',
			value: 'customer_unsubscribed',
		},
	],
	default: [],
	description: 'The events that will trigger the webhook',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook', 'updateWebhook'],
		},
	},
	default: '',
	description: 'A name for the webhook',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'customer':
        return [await executeCustomerOperations.call(this, items)];
      case 'event':
        return [await executeEventOperations.call(this, items)];
      case 'campaign':
        return [await executeCampaignOperations.call(this, items)];
      case 'message':
        return [await executeMessageOperations.call(this, items)];
      case 'segment':
        return [await executeSegmentOperations.call(this, items)];
      case 'webhook':
        return [await executeWebhookOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeCustomerOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('customerioApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getCustomer': {
					const customerId = this.getNodeParameter('customerId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/customers/${customerId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						json: true
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'updateCustomer': {
					const customerId = this.getNodeParameter('customerId', i) as string;
					const attributes = this.getNodeParameter('attributes', i) as any;
					
					const body: any = {};
					if (attributes && attributes.attribute) {
						for (const attr of attributes.attribute) {
							body[attr.name] = attr.value;
						}
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/customers/${customerId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						body,
						json: true
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'deleteCustomer': {
					const customerId = this.getNodeParameter('customerId', i) as string;
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/customers/${customerId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						json: true
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'setCustomerAttributes': {
					const customerId = this.getNodeParameter('customerId', i) as string;
					const attributes = this.getNodeParameter('attributes', i) as any;
					
					const body: any = {};
					if (attributes && attributes.attribute) {
						for (const attr of attributes.attribute) {
							body[attr.name] = attr.value;
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/customers/${customerId}/attributes`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						body,
						json: true
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getAllCustomers': {
					const start = this.getNodeParameter('start', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const filter = this.getNodeParameter('filter', i) as string;
					
					const qs: any = {};
					if (start) qs.start = start;
					if (limit) qs.limit = limit;
					if (filter) qs.filter = filter;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/customers`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						qs,
						json: true
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeEventOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('customerioApi') as any;
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'trackEvent': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const eventName = this.getNodeParameter('eventName', i) as string;
          const eventData = this.getNodeParameter('eventData', i) as object;
          const timestamp = this.getNodeParameter('timestamp', i) as number;
          
          const body: any = {
            name: eventName,
            data: eventData
          };
          
          if (timestamp > 0) {
            body.timestamp = timestamp;
          }
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/customers/${customerId}/events`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCustomerEvents': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const start = this.getNodeParameter('start', i) as number;
          const end = this.getNodeParameter('end', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          
          const queryParams: string[] = [];
          if (start > 0) queryParams.push(`start=${start}`);
          if (end > 0) queryParams.push(`end=${end}`);
          if (limit > 0) queryParams.push(`limit=${limit}`);
          
          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/customers/${customerId}/events${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAllEvents': {
          const start = this.getNodeParameter('start', i) as number;
          const end = this.getNodeParameter('end', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const type = this.getNodeParameter('type', i) as string;
          
          const queryParams: string[] = [];
          if (start > 0) queryParams.push(`start=${start}`);
          if (end > 0) queryParams.push(`end=${end}`);
          if (limit > 0) queryParams.push(`limit=${limit}`);
          if (type) queryParams.push(`type=${type}`);
          
          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/events${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeCampaignOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('customerioApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllCampaigns': {
					const limit = this.getNodeParameter('limit', i, 50) as number;
					const start = this.getNodeParameter('start', i, '') as string;
					
					let url = `${credentials.baseUrl}/campaigns?limit=${limit}`;
					if (start) {
						url += `&start=${encodeURIComponent(start)}`;
					}

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCampaign': {
					const campaignId = this.getNodeParameter('campaignId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/campaigns/${campaignId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCampaignMetrics': {
					const campaignId = this.getNodeParameter('campaignId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/campaigns/${campaignId}/metrics`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'startCampaign': {
					const campaignId = this.getNodeParameter('campaignId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/campaigns/${campaignId}/actions/start`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'stopCampaign': {
					const campaignId = this.getNodeParameter('campaignId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/campaigns/${campaignId}/actions/stop`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeMessageOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('customerioApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'sendTransactionalEmail': {
					const to = this.getNodeParameter('to', i) as string;
					const subject = this.getNodeParameter('subject', i) as string;
					const body = this.getNodeParameter('body', i) as string;
					const identifiers = this.getNodeParameter('identifiers', i) as any;
					const messageData = this.getNodeParameter('message_data', i) as string;

					const requestBody: any = {
						to,
						subject,
						body,
					};

					if (identifiers?.identifierProperties) {
						requestBody.identifiers = identifiers.identifierProperties;
					}

					if (messageData) {
						try {
							requestBody.message_data = JSON.parse(messageData);
						} catch (error: any) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid JSON in message_data: ${error.message}`,
								{ itemIndex: i },
							);
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/send/email`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMessage': {
					const messageId = this.getNodeParameter('message_id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/messages/${messageId}`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllMessages': {
					const start = this.getNodeParameter('start', i) as number;
					const end = this.getNodeParameter('end', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const type = this.getNodeParameter('type', i) as string;

					const qs: any = {};
					if (start) qs.start = start;
					if (end) qs.end = end;
					if (limit) qs.limit = limit;
					if (type) qs.type = type;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/messages`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'sendPushNotification': {
					const to = this.getNodeParameter('to', i) as string;
					const identifiers = this.getNodeParameter('identifiers', i) as any;
					const messageData = this.getNodeParameter('message_data', i) as string;

					const requestBody: any = {
						to,
					};

					if (identifiers?.identifierProperties) {
						requestBody.identifiers = identifiers.identifierProperties;
					}

					if (messageData) {
						try {
							requestBody.message_data = JSON.parse(messageData);
						} catch (error: any) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid JSON in message_data: ${error.message}`,
								{ itemIndex: i },
							);
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/send/push`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeSegmentOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('customerioApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllSegments': {
					const limit = this.getNodeParameter('limit', i) as number;
					const start = this.getNodeParameter('start', i) as string;

					const qs: any = {};
					if (limit) qs.limit = limit;
					if (start) qs.start = start;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/segments`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createSegment': {
					const name = this.getNodeParameter('name', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const conditions = this.getNodeParameter('conditions', i) as string;

					const body: any = {
						name,
					};

					if (description) body.description = description;
					if (conditions) {
						try {
							body.conditions = JSON.parse(conditions);
						} catch (parseError: any) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid JSON in conditions: ${parseError.message}`,
								{ itemIndex: i },
							);
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/segments`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSegment': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/segments/${segmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateSegment': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const conditions = this.getNodeParameter('conditions', i) as string;

					const body: any = {
						name,
					};

					if (description) body.description = description;
					if (conditions) {
						try {
							body.conditions = JSON.parse(conditions);
						} catch (parseError: any) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid JSON in conditions: ${parseError.message}`,
								{ itemIndex: i },
							);
						}
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/segments/${segmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteSegment': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/segments/${segmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSegmentCustomers': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const start = this.getNodeParameter('start', i) as string;

					const qs: any = {};
					if (limit) qs.limit = limit;
					if (start) qs.start = start;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/segments/${segmentId}/customers`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex: i,
					});
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeWebhookOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('customerioApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllWebhooks': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.appApiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createWebhook': {
					const url = this.getNodeParameter('url', i) as string;
					const events = this.getNodeParameter('events', i) as string[];
					const name = this.getNodeParameter('name', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.appApiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							url,
							events,
							name,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.appApiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;
					const url = this.getNodeParameter('url', i) as string;
					const events = this.getNodeParameter('events', i) as string[];
					const name = this.getNodeParameter('name', i) as string;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.appApiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							url,
							events,
							name,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.appApiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result || {},
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
