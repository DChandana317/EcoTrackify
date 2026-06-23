import { StatusCodes } from 'http-status-codes';
import { EmissionService } from '../services/emissionService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createEmission = asyncHandler(async (req, res) => {
  const entry = await EmissionService.createEntry(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Emission entry added',
    data: entry
  });
});

export const listEmissions = asyncHandler(async (req, res) => {
  const data = await EmissionService.listEntries(req.user.id, req.query);
  res.json({ status: 'success', data });
});

export const updateEmission = asyncHandler(async (req, res) => {
  const entry = await EmissionService.updateEntry(req.user.id, req.params.id, req.body);
  res.json({ status: 'success', message: 'Entry updated', data: entry });
});

export const deleteEmission = asyncHandler(async (req, res) => {
  await EmissionService.deleteEntry(req.user.id, req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});
