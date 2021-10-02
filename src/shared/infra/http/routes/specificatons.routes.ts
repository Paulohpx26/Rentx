import { Router } from 'express';

import { CreateSpecificationController } from '@modules/cars/useCases/createSpecification/CreateSpecificationController';
import { ListSpecificatonsController } from '@modules/cars/useCases/listSpecifications/ListSpecificationsController';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const specificatonsRoutes = Router();

const createSpecificationController = new CreateSpecificationController();
const listSpecificatonsController = new ListSpecificatonsController();

specificatonsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createSpecificationController.handle,
);

specificatonsRoutes.get('/', listSpecificatonsController.handle);

export { specificatonsRoutes };
