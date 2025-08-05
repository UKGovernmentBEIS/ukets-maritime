import { OperatorUserDTO, RegulatorUserDTO, UserDTO, VerifierUserDTO } from '@mrtm/api';

export type UserAuthorityDTO = UserDTO | OperatorUserDTO | RegulatorUserDTO | VerifierUserDTO;
