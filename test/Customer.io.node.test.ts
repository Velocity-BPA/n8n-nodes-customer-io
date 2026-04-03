/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Customerio } from '../nodes/Customer.io/Customer.io.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Customerio Node', () => {
  let node: Customerio;

  beforeAll(() => {
    node = new Customerio();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Customer.io');
      expect(node.description.name).toBe('customerio');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Customer Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://beta-api.customer.io/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			}
		};
	});

	it('should get customer successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getCustomer')
			.mockReturnValueOnce('123');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: '123',
			email: 'test@example.com'
		});

		const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toEqual([{
			json: { id: '123', email: 'test@example.com' },
			pairedItem: { item: 0 }
		}]);
	});

	it('should update customer successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateCustomer')
			.mockReturnValueOnce('123')
			.mockReturnValueOnce({
				attribute: [{ name: 'email', value: 'updated@example.com' }]
			});
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

		const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toEqual([{
			json: { success: true },
			pairedItem: { item: 0 }
		}]);
	});

	it('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCustomer');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 }
		}]);
	});
});

describe('Event Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ bearerToken: 'test-token', baseUrl: 'https://beta-api.customer.io/v1' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });
  
  describe('trackEvent operation', () => {
    it('should track an event successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('trackEvent')
        .mockReturnValueOnce('customer123')
        .mockReturnValueOnce('purchase')
        .mockReturnValueOnce({ amount: 100, product: 'widget' })
        .mockReturnValueOnce(0);
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });
      
      const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://beta-api.customer.io/v1/customers/customer123/events',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        body: {
          name: 'purchase',
          data: { amount: 100, product: 'widget' }
        },
        json: true
      });
      
      expect(result).toEqual([{ json: { success: true }, pairedItem: { item: 0 } }]);
    });
    
    it('should handle track event errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('trackEvent')
        .mockReturnValueOnce('customer123')
        .mockReturnValueOnce('purchase')
        .mockReturnValueOnce({})
        .mockReturnValueOnce(0);
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
  
  describe('getCustomerEvents operation', () => {
    it('should get customer events successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCustomerEvents')
        .mockReturnValueOnce('customer123')
        .mockReturnValueOnce(1609459200)
        .mockReturnValueOnce(1609545600)
        .mockReturnValueOnce(50);
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ events: [] });
      
      const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://beta-api.customer.io/v1/customers/customer123/events?start=1609459200&end=1609545600&limit=50',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
      
      expect(result).toEqual([{ json: { events: [] }, pairedItem: { item: 0 } }]);
    });
  });
  
  describe('getAllEvents operation', () => {
    it('should get all events successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllEvents')
        .mockReturnValueOnce(1609459200)
        .mockReturnValueOnce(1609545600)
        .mockReturnValueOnce(100)
        .mockReturnValueOnce('purchase');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ events: [] });
      
      const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://beta-api.customer.io/v1/events?start=1609459200&end=1609545600&limit=100&type=purchase',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
      
      expect(result).toEqual([{ json: { events: [] }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Campaign Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://beta-api.customer.io/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('should get all campaigns', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllCampaigns')
			.mockReturnValueOnce(25)
			.mockReturnValueOnce('cursor123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			campaigns: [{ id: 1, name: 'Test Campaign' }],
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://beta-api.customer.io/v1/campaigns?limit=25&start=cursor123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toHaveLength(1);
	});

	test('should get campaign details', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getCampaign')
			.mockReturnValueOnce('123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			campaign: { id: 123, name: 'Test Campaign' },
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://beta-api.customer.io/v1/campaigns/123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toHaveLength(1);
	});

	test('should get campaign metrics', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getCampaignMetrics')
			.mockReturnValueOnce('123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			metrics: { sent: 100, opened: 50 },
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://beta-api.customer.io/v1/campaigns/123/metrics',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toHaveLength(1);
	});

	test('should start campaign', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('startCampaign')
			.mockReturnValueOnce('123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://beta-api.customer.io/v1/campaigns/123/actions/start',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toHaveLength(1);
	});

	test('should stop campaign', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('stopCampaign')
			.mockReturnValueOnce('123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
		});

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://beta-api.customer.io/v1/campaigns/123/actions/stop',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toHaveLength(1);
	});

	test('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCampaign');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	test('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCampaign');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('API Error');
	});
});

describe('Message Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://beta-api.customer.io/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('sendTransactionalEmail', () => {
		it('should send transactional email successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendTransactionalEmail')
				.mockReturnValueOnce('test@example.com')
				.mockReturnValueOnce('Test Subject')
				.mockReturnValueOnce('<p>Test body</p>')
				.mockReturnValueOnce({ identifierProperties: { id: 'user123' } })
				.mockReturnValueOnce('{"name": "John"}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				message_id: 'msg_123',
				status: 'sent',
			});

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://beta-api.customer.io/v1/send/email',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					to: 'test@example.com',
					subject: 'Test Subject',
					body: '<p>Test body</p>',
					identifiers: { id: 'user123' },
					message_data: { name: 'John' },
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { message_id: 'msg_123', status: 'sent' },
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle invalid JSON in message_data', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendTransactionalEmail')
				.mockReturnValueOnce('test@example.com')
				.mockReturnValueOnce('Test Subject')
				.mockReturnValueOnce('<p>Test body</p>')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('invalid json');

			await expect(
				executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow();
		});
	});

	describe('getMessage', () => {
		it('should get message successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMessage')
				.mockReturnValueOnce('msg_123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'msg_123',
				status: 'delivered',
				created_at: 1640995200,
			});

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://beta-api.customer.io/v1/messages/msg_123',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { id: 'msg_123', status: 'delivered', created_at: 1640995200 },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getAllMessages', () => {
		it('should get all messages successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllMessages')
				.mockReturnValueOnce(1640995200)
				.mockReturnValueOnce(1641081600)
				.mockReturnValueOnce(50)
				.mockReturnValueOnce('email');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				messages: [
					{ id: 'msg_1', status: 'delivered' },
					{ id: 'msg_2', status: 'sent' },
				],
			});

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://beta-api.customer.io/v1/messages',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				qs: {
					start: 1640995200,
					end: 1641081600,
					limit: 50,
					type: 'email',
				},
				json: true,
			});

			expect(result[0].json.messages).toHaveLength(2);
		});
	});

	describe('sendPushNotification', () => {
		it('should send push notification successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendPushNotification')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce({ identifierProperties: { id: 'user123' } })
				.mockReturnValueOnce('{"title": "Hello", "body": "World"}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				message_id: 'push_123',
				status: 'sent',
			});

			const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://beta-api.customer.io/v1/send/push',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					to: 'user123',
					identifiers: { id: 'user123' },
					message_data: { title: 'Hello', body: 'World' },
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { message_id: 'push_123', status: 'sent' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	it('should handle API errors', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getMessage')
			.mockReturnValueOnce('invalid_id');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Message not found'));

		await expect(
			executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('Message not found');
	});

	it('should continue on fail when configured', async () => {
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getMessage')
			.mockReturnValueOnce('invalid_id');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Message not found'));

		const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([
			{
				json: { error: 'Message not found' },
				pairedItem: { item: 0 },
			},
		]);
	});
});

describe('Segment Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://beta-api.customer.io/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getAllSegments', () => {
		it('should get all segments successfully', async () => {
			const mockResponse = { segments: [{ id: '123', name: 'Test Segment' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'getAllSegments';
					case 'limit': return 50;
					case 'start': return '';
					default: return undefined;
				}
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://beta-api.customer.io/v1/segments',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				qs: { limit: 50 },
				json: true,
			});
		});

		it('should handle errors', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllSegments');

			await expect(
				executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow('API Error');
		});
	});

	describe('createSegment', () => {
		it('should create a segment successfully', async () => {
			const mockResponse = { id: '123', name: 'Test Segment' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'createSegment';
					case 'name': return 'Test Segment';
					case 'description': return 'Test Description';
					case 'conditions': return '{"and":[]}';
					default: return undefined;
				}
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getSegment', () => {
		it('should get segment by ID successfully', async () => {
			const mockResponse = { id: '123', name: 'Test Segment' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'getSegment';
					case 'segmentId': return '123';
					default: return undefined;
				}
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateSegment', () => {
		it('should update segment successfully', async () => {
			const mockResponse = { id: '123', name: 'Updated Segment' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'updateSegment';
					case 'segmentId': return '123';
					case 'name': return 'Updated Segment';
					case 'description': return 'Updated Description';
					case 'conditions': return '{"and":[]}';
					default: return undefined;
				}
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteSegment', () => {
		it('should delete segment successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'deleteSegment';
					case 'segmentId': return '123';
					default: return undefined;
				}
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getSegmentCustomers', () => {
		it('should get segment customers successfully', async () => {
			const mockResponse = { customers: [{ id: '456', email: 'test@example.com' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'getSegmentCustomers';
					case 'segmentId': return '123';
					case 'limit': return 50;
					case 'start': return '';
					default: return undefined;
				}
			});

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Webhook Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				appApiKey: 'test-app-key',
				baseUrl: 'https://beta-api.customer.io/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAllWebhooks', () => {
		it('should get all webhooks successfully', async () => {
			const mockWebhooks = { webhooks: [{ id: '1', name: 'Test Webhook' }] };
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllWebhooks');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhooks);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockWebhooks, pairedItem: { item: 0 } }]);
		});

		it('should handle getAllWebhooks error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllWebhooks');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('createWebhook', () => {
		it('should create webhook successfully', async () => {
			const mockWebhook = { id: '123', name: 'New Webhook' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhook')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce(['email_sent', 'email_opened'])
				.mockReturnValueOnce('Test Webhook');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhook);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockWebhook, pairedItem: { item: 0 } }]);
		});

		it('should handle createWebhook error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhook')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce(['email_sent'])
				.mockReturnValueOnce('Test Webhook');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Create failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Create failed' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getWebhook', () => {
		it('should get webhook successfully', async () => {
			const mockWebhook = { id: '123', name: 'Test Webhook' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWebhook')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhook);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockWebhook, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateWebhook', () => {
		it('should update webhook successfully', async () => {
			const mockWebhook = { id: '123', name: 'Updated Webhook' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateWebhook')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('https://example.com/updated')
				.mockReturnValueOnce(['email_sent'])
				.mockReturnValueOnce('Updated Webhook');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhook);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockWebhook, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteWebhook', () => {
		it('should delete webhook successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWebhook')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: {}, pairedItem: { item: 0 } }]);
		});
	});
});
});
