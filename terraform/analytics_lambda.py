import json
import boto3
import gzip
from datetime import datetime
from collections import defaultdict
import re

cloudwatch = boto3.client('cloudwatch')
s3 = boto3.client('s3')

def handler(event, context):
    """Process CloudFront logs and send metrics to CloudWatch"""
    
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        # Skip if not a log file
        if not key.endswith('.gz'):
            continue
            
        try:
            # Download and decompress log file
            response = s3.get_object(Bucket=bucket, Key=key)
            content = gzip.decompress(response['Body'].read()).decode('utf-8')
            
            # Parse logs and extract metrics
            metrics = parse_logs(content)
            
            # Send metrics to CloudWatch
            send_metrics(metrics)
            
        except Exception as e:
            print(f"Error processing {key}: {str(e)}")
    
    return {'statusCode': 200}

def parse_logs(content):
    """Parse CloudFront logs and extract key metrics"""
    lines = content.strip().split('\n')
    
    # Skip header lines
    data_lines = [line for line in lines if not line.startswith('#')]
    
    metrics = {
        'page_views': 0,
        'unique_ips': set(),
        'status_codes': defaultdict(int),
        'top_pages': defaultdict(int),
        'user_agents': defaultdict(int),
        'referrers': defaultdict(int),
        'countries': defaultdict(int),
        'bytes_sent': 0,
        'error_count': 0,
        'bot_requests': 0
    }
    
    for line in data_lines:
        if not line.strip():
            continue
            
        fields = line.split('\t')
        if len(fields) < 24:
            continue
            
        try:
            # Extract key fields
            c_ip = fields[4]
            cs_method = fields[5]
            cs_uri_stem = fields[7]
            sc_status = int(fields[8])
            cs_user_agent = fields[10]
            cs_referer = fields[9]
            sc_bytes = int(fields[3]) if fields[3] != '-' else 0
            x_edge_location = fields[2]
            
            # Count page views (GET requests for HTML pages)
            if cs_method == 'GET' and not is_static_resource(cs_uri_stem):
                metrics['page_views'] += 1
                metrics['top_pages'][cs_uri_stem] += 1
            
            # Track unique IPs
            metrics['unique_ips'].add(c_ip)
            
            # Status codes
            metrics['status_codes'][sc_status] += 1
            
            # Error tracking
            if sc_status >= 400:
                metrics['error_count'] += 1
            
            # Bot detection
            if is_bot(cs_user_agent):
                metrics['bot_requests'] += 1
            
            # Bytes sent
            metrics['bytes_sent'] += sc_bytes
            
            # Referrers
            if cs_referer != '-':
                metrics['referrers'][cs_referer] += 1
            
            # Country from edge location
            country = extract_country_from_edge(x_edge_location)
            if country:
                metrics['countries'][country] += 1
                
        except (ValueError, IndexError):
            continue
    
    return metrics

def is_static_resource(uri):
    """Check if URI is a static resource"""
    static_extensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.pdf']
    return any(uri.lower().endswith(ext) for ext in static_extensions)

def is_bot(user_agent):
    """Detect if request is from a bot"""
    bot_patterns = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget']
    return any(pattern in user_agent.lower() for pattern in bot_patterns)

def extract_country_from_edge(edge_location):
    """Extract country code from edge location"""
    # CloudFront edge locations format: XXX-X (first 3 chars are airport code)
    airport_to_country = {
        'IAD': 'US', 'DFW': 'US', 'SEA': 'US', 'SFO': 'US', 'LAX': 'US',
        'LHR': 'GB', 'FRA': 'DE', 'CDG': 'FR', 'AMS': 'NL', 'ARN': 'SE',
        'NRT': 'JP', 'ICN': 'KR', 'SIN': 'SG', 'SYD': 'AU', 'GRU': 'BR'
    }
    
    if len(edge_location) >= 3:
        airport = edge_location[:3]
        return airport_to_country.get(airport, 'Unknown')
    return 'Unknown'

def send_metrics(metrics):
    """Send metrics to CloudWatch"""
    timestamp = datetime.utcnow()
    
    metric_data = [
        {
            'MetricName': 'PageViews',
            'Value': metrics['page_views'],
            'Unit': 'Count',
            'Timestamp': timestamp
        },
        {
            'MetricName': 'UniqueVisitors',
            'Value': len(metrics['unique_ips']),
            'Unit': 'Count',
            'Timestamp': timestamp
        },
        {
            'MetricName': 'ErrorRate',
            'Value': (metrics['error_count'] / max(metrics['page_views'], 1)) * 100,
            'Unit': 'Percent',
            'Timestamp': timestamp
        },
        {
            'MetricName': 'BotRequests',
            'Value': metrics['bot_requests'],
            'Unit': 'Count',
            'Timestamp': timestamp
        },
        {
            'MetricName': 'BytesSent',
            'Value': metrics['bytes_sent'],
            'Unit': 'Bytes',
            'Timestamp': timestamp
        },
        {
            'MetricName': 'TotalRequests',
            'Value': sum(metrics['status_codes'].values()),
            'Unit': 'Count',
            'Timestamp': timestamp
        },
        {
            'MetricName': 'Status200',
            'Value': metrics['status_codes'].get(200, 0),
            'Unit': 'Count',
            'Timestamp': timestamp
        },
        {
            'MetricName': 'Status404',
            'Value': metrics['status_codes'].get(404, 0),
            'Unit': 'Count',
            'Timestamp': timestamp
        },
        {
            'MetricName': 'Status500',
            'Value': metrics['status_codes'].get(500, 0),
            'Unit': 'Count',
            'Timestamp': timestamp
        },
        {
            'MetricName': 'UniqueCountries',
            'Value': len(metrics['countries']),
            'Unit': 'Count',
            'Timestamp': timestamp
        }
    ]
    
    # Send metrics in batches of 20 (CloudWatch limit)
    for i in range(0, len(metric_data), 20):
        batch = metric_data[i:i+20]
        cloudwatch.put_metric_data(
            Namespace='Portfolio',
            MetricData=batch
        )
    
    print(f"Sent {len(metric_data)} metrics to CloudWatch")