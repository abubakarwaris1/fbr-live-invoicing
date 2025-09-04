#!/usr/bin/env node

import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const FBR_ACCESS_TOKEN = process.env.FBR_ACCESS_TOKEN;

if (!FBR_ACCESS_TOKEN) {
  console.error('❌ FBR_ACCESS_TOKEN not found in environment variables');
  console.log('Please add FBR_ACCESS_TOKEN to your .env file');
  process.exit(1);
}

console.log('🔑 FBR Access Token found:', FBR_ACCESS_TOKEN.substring(0, 10) + '...');

// FBR API Configuration
const FBR_CONFIG = {
  // Sandbox URLs
  VALIDATE_ENDPOINT: 'https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb',
  POST_ENDPOINT: 'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb',
};

// Sample invoice data for testing
const sampleInvoiceData = {
  invoiceType: "1100",
  invoiceDate: "2024-01-15",
  invoiceRefNo: "INV-2024-001",
  scenarioId: "1",
  sellerNTNCNIC: "1234567890123",
  sellerBusinessName: "Test Seller Company",
  sellerAddress: "123 Seller Street, Islamabad",
  sellerProvince: "Federal",
  buyerNTNCNIC: "9876543210987",
  buyerBusinessName: "Test Buyer Company",
  buyerAddress: "456 Buyer Avenue, Karachi",
  buyerProvince: "Sindh",
  buyerRegistrationType: "1",
  totalAmount: 10000.00,
  items: [
    {
      itemName: "Test Product 1",
      quantity: 5,
      unitPrice: 1000.00,
      totalPrice: 5000.00,
      uom: "PCS"
    },
    {
      itemName: "Test Product 2",
      quantity: 2,
      unitPrice: 2500.00,
      totalPrice: 5000.00,
      uom: "KG"
    }
  ]
};

/**
 * Make authenticated request to FBR API
 */
async function makeFbrRequest(url, data, endpointName) {
  console.log(`\n🚀 Testing ${endpointName}...`);
  console.log(`📡 URL: ${url}`);
  console.log(`📦 Request Data:`, JSON.stringify(data, null, 2));
  
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'FBR-Live-Invoicing/1.0',
      'Authorization': `Bearer ${FBR_ACCESS_TOKEN}`
    };

    console.log(`🔐 Headers:`, {
      'Content-Type': headers['Content-Type'],
      'Accept': headers['Accept'],
      'User-Agent': headers['User-Agent'],
      'Authorization': 'Bearer ' + FBR_ACCESS_TOKEN.substring(0, 10) + '...'
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Response Headers:`, Object.fromEntries(response.headers.entries()));

    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error(`❌ Network Error for ${endpointName}:`, error.message);
    return {
      ok: false,
      error: error.message,
      status: 0,
      data: null
    };
  }
}

/**
 * Test Validation API
 */
async function testValidationAPI() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 TESTING FBR VALIDATION API');
  console.log('='.repeat(60));
  
  const result = await makeFbrRequest(
    FBR_CONFIG.VALIDATE_ENDPOINT,
    sampleInvoiceData,
    'Validation API'
  );

  console.log('\n📋 VALIDATION API RESPONSE:');
  console.log('='.repeat(40));
  
  if (result.ok) {
    console.log('✅ SUCCESS - Validation API responded successfully');
    console.log('📄 Response Data:');
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log('❌ FAILED - Validation API error');
    console.log('🔍 Error Details:');
    console.log('Status:', result.status);
    console.log('Status Text:', result.statusText);
    console.log('Response Data:');
    console.log(JSON.stringify(result.data, null, 2));
  }

  return result;
}

/**
 * Test Submission API
 */
async function testSubmissionAPI() {
  console.log('\n' + '='.repeat(60));
  console.log('📤 TESTING FBR SUBMISSION API');
  console.log('='.repeat(60));
  
  const result = await makeFbrRequest(
    FBR_CONFIG.POST_ENDPOINT,
    sampleInvoiceData,
    'Submission API'
  );

  console.log('\n📋 SUBMISSION API RESPONSE:');
  console.log('='.repeat(40));
  
  if (result.ok) {
    console.log('✅ SUCCESS - Submission API responded successfully');
    console.log('📄 Response Data:');
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log('❌ FAILED - Submission API error');
    console.log('🔍 Error Details:');
    console.log('Status:', result.status);
    console.log('Status Text:', result.statusText);
    console.log('Response Data:');
    console.log(JSON.stringify(result.data, null, 2));
  }

  return result;
}

/**
 * Test with minimal data
 */
async function testWithMinimalData() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTING WITH MINIMAL DATA');
  console.log('='.repeat(60));
  
  const minimalData = {
    invoiceType: "1100",
    invoiceDate: "2024-01-15",
    sellerNTNCNIC: "1234567890123",
    buyerNTNCNIC: "9876543210987"
  };

  console.log('📦 Minimal Test Data:', JSON.stringify(minimalData, null, 2));
  
  const result = await makeFbrRequest(
    FBR_CONFIG.VALIDATE_ENDPOINT,
    minimalData,
    'Validation API (Minimal Data)'
  );

  console.log('\n📋 MINIMAL DATA RESPONSE:');
  console.log('='.repeat(40));
  
  if (result.ok) {
    console.log('✅ SUCCESS - Minimal data test passed');
    console.log('📄 Response Data:');
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log('❌ FAILED - Minimal data test failed');
    console.log('🔍 Error Details:');
    console.log('Status:', result.status);
    console.log('Status Text:', result.statusText);
    console.log('Response Data:');
    console.log(JSON.stringify(result.data, null, 2));
  }

  return result;
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting FBR API Tests...');
  console.log('🔧 Environment: Sandbox');
  console.log('🔑 Token Status: ' + (FBR_ACCESS_TOKEN ? 'Available' : 'Missing'));
  
  try {
    // Test 1: Validation API with full data
    const validationResult = await testValidationAPI();
    
    // Test 2: Submission API with full data
    const submissionResult = await testSubmissionAPI();
    
    // Test 3: Validation API with minimal data
    const minimalResult = await testWithMinimalData();
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('Validation API (Full Data):', validationResult.ok ? '✅ PASS' : '❌ FAIL');
    console.log('Submission API (Full Data):', submissionResult.ok ? '✅ PASS' : '❌ FAIL');
    console.log('Validation API (Minimal Data):', minimalResult.ok ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Check the response data above to understand FBR API format');
    console.log('2. Update the transformInvoiceForFbr() function based on actual requirements');
    console.log('3. Handle any specific error codes or validation rules');
    console.log('4. Switch to production URLs when ready');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Run the tests
runTests().catch(console.error); 