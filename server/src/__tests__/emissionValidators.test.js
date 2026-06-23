import { emissionCreateSchema } from '../validators/emissionValidators.js';

describe('emissionCreateSchema', () => {
  it('rejects negative quantities', async () => {
    await expect(
      emissionCreateSchema.validateAsync({
        category: 'transportation',
        quantity: -5,
        unit: 'km',
        emissionFactor: 0.1,
        entryDate: new Date().toISOString()
      })
    ).rejects.toThrow();
  });

  it('accepts valid payloads', async () => {
    const result = await emissionCreateSchema.validateAsync({
      category: 'energy',
      quantity: 25,
      unit: 'kwh',
      emissionFactor: 0.4,
      entryDate: new Date().toISOString(),
      notes: 'Smart meter reading'
    });
    expect(result.quantity).toBe(25);
  });
});
