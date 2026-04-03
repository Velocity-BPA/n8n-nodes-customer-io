import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CustomerioApi implements ICredentialType {
	name = 'customerioApi';
	displayName = 'Customer.io API';
	documentationUrl = 'https://customer.io/docs/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Customer.io App API Key. Create API credentials in your Customer.io workspace settings.',
			required: true,
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://beta-api.customer.io/v1',
			description: 'The base URL for Customer.io API requests',
			required: true,
		},
	];
}