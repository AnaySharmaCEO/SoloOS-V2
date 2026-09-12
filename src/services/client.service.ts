import * as clientsApi from '../api/clients.api';
import * as activityService from './activity.service';
import type { ApiResponse, Client, Lead, UpdateClientInput } from '../types';

export async function getAllClients(userId: string): Promise<ApiResponse<Client[]>> {
  return clientsApi.getClients(userId);
}

export async function getClientForLead(
  leadId: string,
  userId: string
): Promise<ApiResponse<Client | null>> {
  return clientsApi.getClientByLeadId(leadId, userId);
}

export async function getClientById(
  clientId: string,
  userId: string
): Promise<ApiResponse<Client>> {
  return clientsApi.getClientById(clientId, userId);
}

export async function createClientFromLead(
  userId: string,
  lead: Lead
): Promise<ApiResponse<Client>> {
  const existing = await clientsApi.getClientByLeadId(lead.id, userId);
  if (existing.data) return { data: existing.data, error: null };

  const result = await clientsApi.createClient(userId, {
    lead_id: lead.id,
    client_name: lead.name,
    company: lead.company,
    total_revenue: lead.estimated_value,
    notes: lead.win_reason || undefined,
  });

  if (result.data) {
    await activityService.logActivity(userId, {
      lead_id: lead.id,
      client_id: result.data.id,
      action_type: 'client_created',
      action_label: `Client record created for ${lead.name}`,
    });
  }

  return result;
}

export async function updateClient(
  clientId: string,
  userId: string,
  updates: UpdateClientInput
): Promise<ApiResponse<Client>> {
  return clientsApi.updateClient(clientId, userId, updates);
}

export async function deleteClient(
  clientId: string,
  userId: string
): Promise<ApiResponse<void>> {
  return clientsApi.deleteClient(clientId, userId);
}
