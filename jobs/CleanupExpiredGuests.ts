import cron from "node-cron";
import { ObjectLiteral, Repository } from "typeorm";

import { AppDataSource } from "../db/DataSource.ts";

cron.schedule("0 * * * *", () => {
  const guestRepository: Repository<ObjectLiteral> = AppDataSource.getRepository("Guest");
  guestRepository
    .createQueryBuilder("guest")
    .where("guest.expiresAt < NOW()")
    .getMany()
    .then((expiredGuests: ObjectLiteral[]) => {
      if (expiredGuests.length > 0) {
        return guestRepository.remove(expiredGuests);
      }
    })
    .catch((err: Error) => {
      console.error("An error occurred while cleaning up expired guests: ", err);
    });
});
