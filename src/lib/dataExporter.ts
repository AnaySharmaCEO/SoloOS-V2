import * as XLSX from 'xlsx';
import * as leadService from '../services/lead.service';
import * as clientService from '../services/client.service';
import * as followupService from '../services/followup.service';
import * as proposalService from '../services/proposal.service';

interface ExportResult {
  success: boolean;
  error?: string;
}

/**
 * Service to aggregate and export all SoloOS user workspace data into
 * a single structured .xlsx spreadsheet containing four first-class sheets.
 */
export async function exportAllWorkspaceData(userId: string | undefined): Promise<ExportResult> {
  if (!userId) {
    return { success: false, error: 'User is not authenticated' };
  }

  try {
    // 1. Fetch all data in parallel
    const [leadsRes, clientsRes, followupsRes, proposalsRes] = await Promise.all([
      leadService.getAllLeads(userId),
      clientService.getAllClients(userId),
      followupService.getAllFollowUps(userId),
      proposalService.getAllProposals(userId)
    ]);

    // 2. Format Sheet 1: Leads
    const leadsData = (leadsRes.data || []).map((lead) => {
      // Risk level calculation
      let riskLevel = 'Low';
      if (lead.days_in_stage > 5) {
        riskLevel = 'High';
      } else if (lead.days_in_stage > 3) {
        riskLevel = 'Medium';
      }

      return {
        'Lead Name': lead.name,
        'Company': lead.company || 'N/A',
        'Email': lead.email || 'N/A',
        'Phone': lead.phone || 'N/A',
        'Current Stage': lead.stage,
        'Estimated Value': lead.estimated_value,
        'Last Contact': lead.last_contact_date ? new Date(lead.last_contact_date).toLocaleDateString() : 'Never',
        'Next Action': lead.next_action || 'None',
        'Next Step Owner': 'Me',
        'Risk Level': riskLevel,
        'Lead Source': lead.source || 'Unknown',
        'Created Date': new Date(lead.created_at).toLocaleDateString(),
        'Updated Date': new Date(lead.updated_at).toLocaleDateString()
      };
    });

    // 3. Format Sheet 2: Clients
    const clientsData = (clientsRes.data || []).map((client) => {
      return {
        'Client Name': client.client_name,
        'Company': client.company || 'N/A',
        'Email': client.client_email || 'N/A',
        'Lifetime Value': client.total_revenue,
        'Retainer Status': client.retainer_active ? 'Active' : 'Inactive',
        'Repeat Jobs': client.repeat_work_count,
        'Relationship Status': client.relationship_status || 'Good',
        'Next Strategic Action': client.next_client_action || 'None',
        'Referral Status': client.referral_opportunity || 'No Active Opportunity',
        'Testimonial Status': client.client_status === 'Active' ? 'Not Requested' : 'Completed',
        'Created Date': new Date(client.created_at).toLocaleDateString()
      };
    });

    // 4. Format Sheet 3: Follow-Ups
    const followupsData = (followupsRes.data || []).map((f) => {
      return {
        'Lead Name': f.lead_name || 'N/A',
        'Follow-Up Type': f.reason,
        'Priority': f.urgency.toUpperCase(),
        'Due Date': new Date(f.due_date).toLocaleDateString(),
        'Status': f.status.toUpperCase(),
        'Suggested Message': f.suggested_message || 'N/A',
        'Channel': f.channel_used || 'N/A',
        'Last Sent': f.sent_at ? new Date(f.sent_at).toLocaleDateString() : 'Never',
        'Created Date': new Date(f.created_at).toLocaleDateString()
      };
    });

    // 5. Format Sheet 4: Proposals
    const proposalsData = (proposalsRes.data || []).map((p) => {
      return {
        'Lead Name': p.lead_name || 'N/A',
        'Proposal Value': p.amount,
        'Proposal Status': p.status,
        'Sent Date': new Date(p.sent_date).toLocaleDateString(),
        'Expected Reply': p.expected_reply_date ? new Date(p.expected_reply_date).toLocaleDateString() : 'N/A',
        'Reminder Count': p.reminder_count || 0,
        'Accepted / Rejected': p.status === 'Accepted' ? 'Accepted' : p.status === 'Rejected' ? 'Rejected' : 'Pending',
        'Closed Date': p.actual_reply_date ? new Date(p.actual_reply_date).toLocaleDateString() : 'N/A'
      };
    });

    // 6. Build the Excel workbook
    const workbook = XLSX.utils.book_new();

    // Add sheets with data or empty arrays if no records are found
    const leadsSheet = XLSX.utils.json_to_sheet(leadsData.length ? leadsData : [{}]);
    const clientsSheet = XLSX.utils.json_to_sheet(clientsData.length ? clientsData : [{}]);
    const followupsSheet = XLSX.utils.json_to_sheet(followupsData.length ? followupsData : [{}]);
    const proposalsSheet = XLSX.utils.json_to_sheet(proposalsData.length ? proposalsData : [{}]);

    XLSX.utils.book_append_sheet(workbook, leadsSheet, 'Leads');
    XLSX.utils.book_append_sheet(workbook, clientsSheet, 'Clients');
    XLSX.utils.book_append_sheet(workbook, followupsSheet, 'Follow-Ups');
    XLSX.utils.book_append_sheet(workbook, proposalsSheet, 'Proposals');

    // 7. Write the file and trigger automatic browser download
    const dateString = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `SoloOS_Workspace_Export_${dateString}.xlsx`);

    return { success: true };
  } catch (err: any) {
    console.error('Excel export failure:', err);
    return { success: false, error: err?.message || 'Unknown export error' };
  }
}
