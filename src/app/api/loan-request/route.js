import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { bankId, bankName, employment, income, emis, amount } = data;

    if (!bankId || !bankName || !employment || !income || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required eligibility criteria fields.' },
        { status: 400 }
      );
    }

    // Generate simulated tracking metadata matching corporate banking standards
    const newLoanRequest = {
      id: Date.now(),
      requestId: `REQ${Math.floor(100000 + Math.random() * 900000)}`,
      bankId,
      bankName,
      employment,
      income: Number(income),
      emis: Number(emis || 0),
      amount: Number(amount),
      status: 'Pending', // Defaults strictly to PENDING
      date: new Date().toISOString(),
    };

    console.log('Successfully saved new loan request on platform backend:', newLoanRequest);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Home loan eligibility application submitted successfully.', 
        loan: newLoanRequest 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling loan request API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server failure saving loan request.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'Loans Request API is operational. Send a POST request to apply for a loan.' 
  });
}
