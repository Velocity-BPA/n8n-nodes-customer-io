# n8n-nodes-customer-io

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Customer.io integration, providing access to 6 core resources including customers, events, campaigns, messages, segments, and webhooks. This node enables automated customer engagement workflows with full CRUD operations, event tracking, campaign management, and real-time webhook processing for data-driven marketing automation.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Customer.io](https://img.shields.io/badge/Customer.io-API-green)
![Marketing Automation](https://img.shields.io/badge/Marketing-Automation-orange)
![Real-time Events](https://img.shields.io/badge/Real--time-Events-red)

## Features

- **Customer Management** - Create, update, retrieve, and delete customer profiles with custom attributes
- **Event Tracking** - Track custom events and behaviors with comprehensive metadata
- **Campaign Operations** - Manage email campaigns, newsletters, and automated messaging sequences
- **Message Handling** - Send transactional emails, SMS, and push notifications
- **Segment Management** - Create and manage dynamic customer segments based on attributes and behaviors
- **Webhook Integration** - Process real-time Customer.io webhooks for events, deliveries, and customer updates
- **Bulk Operations** - Support for batch customer imports and bulk event tracking
- **Advanced Filtering** - Query customers and messages with sophisticated filtering options

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-customer-io`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-customer-io
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-customer-io.git
cd n8n-nodes-customer-io
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-customer-io
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| Site ID | Your Customer.io Site ID found in account settings | Yes |
| API Key | Customer.io API Key with appropriate permissions | Yes |
| App API Key | App API Key for transactional messaging (optional) | No |
| Region | Customer.io region (US or EU) | Yes |

## Resources & Operations

### 1. Customer

| Operation | Description |
|-----------|-------------|
| Create | Create a new customer profile with attributes |
| Update | Update existing customer attributes and properties |
| Get | Retrieve customer details by ID or email |
| Delete | Remove a customer from your workspace |
| List | Get paginated list of customers with filtering |
| Add to Segment | Add customer to a specific segment |
| Remove from Segment | Remove customer from a segment |

### 2. Event

| Operation | Description |
|-----------|-------------|
| Track | Track custom events for customers |
| Track Page View | Record page view events |
| Track Anonymous | Track events for anonymous visitors |
| Bulk Track | Submit multiple events in a single request |
| Get Events | Retrieve event history for a customer |

### 3. Campaign

| Operation | Description |
|-----------|-------------|
| List | Get all campaigns with filtering options |
| Get | Retrieve specific campaign details |
| Get Metrics | Get campaign performance metrics |
| Get Actions | List campaign actions and triggers |
| Update | Modify campaign settings |
| Trigger | Manually trigger campaign for customers |

### 4. Message

| Operation | Description |
|-----------|-------------|
| Send Transactional | Send transactional emails via API |
| Send Push | Send push notifications to mobile devices |
| Send SMS | Send SMS messages to customers |
| List | Get message history with filtering |
| Get | Retrieve specific message details |
| Get Metrics | Get message delivery and engagement metrics |

### 5. Segment

| Operation | Description |
|-----------|-------------|
| List | Get all segments in your workspace |
| Get | Retrieve segment details and member count |
| Create | Create new customer segments |
| Update | Modify segment criteria and settings |
| Delete | Remove segments from workspace |
| Get Members | List customers in a specific segment |

### 6. Webhook

| Operation | Description |
|-----------|-------------|
| List | Get configured webhook endpoints |
| Create | Set up new webhook endpoints |
| Update | Modify webhook settings and events |
| Delete | Remove webhook configurations |
| Test | Test webhook endpoint connectivity |
| Get Events | List webhook event types |

## Usage Examples

```javascript
// Track user signup event
{
  "customer_id": "user_12345",
  "name": "signed_up",
  "data": {
    "plan": "premium",
    "source": "website",
    "trial_days": 30
  }
}
```

```javascript
// Create customer with attributes
{
  "id": "user_67890",
  "email": "john@example.com",
  "attributes": {
    "first_name": "John",
    "last_name": "Doe",
    "plan": "enterprise",
    "created_at": 1640995200
  }
}
```

```javascript
// Send transactional email
{
  "transactional_message_id": "welcome_email",
  "to": "jane@example.com",
  "message_data": {
    "name": "Jane",
    "activation_link": "https://app.example.com/activate/abc123"
  },
  "identifiers": {
    "id": "user_54321"
  }
}
```

```javascript
// Create customer segment
{
  "name": "High Value Customers",
  "description": "Customers with lifetime value > $1000",
  "segment": {
    "and": [
      {
        "attribute": {
          "field": "lifetime_value",
          "operator": "gt",
          "value": 1000
        }
      }
    ]
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API credentials | Verify Site ID and API Key in credentials |
| 403 Forbidden | Insufficient permissions | Check API key permissions in Customer.io dashboard |
| 404 Not Found | Customer or resource not found | Verify customer ID or resource identifier exists |
| 429 Rate Limited | API rate limit exceeded | Implement delays between requests or reduce frequency |
| 400 Bad Request | Invalid request data | Validate required fields and data formats |
| 500 Server Error | Customer.io service error | Retry request after delay or check Customer.io status |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-customer-io/issues)
- **Customer.io API Docs**: [Customer.io API Documentation](https://customer.io/docs/api/)
- **Customer.io Community**: [Customer.io Community Forum](https://community.customer.io/)