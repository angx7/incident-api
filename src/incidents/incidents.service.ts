import { Injectable } from '@nestjs/common';
import { EmailOptions } from 'src/core/models/email-options.model';
import { Incident } from 'src/core/entities/incident.entity';
import { EmailService } from 'src/email/email.service';
import { generateIncidentEmailTemplate } from './templates/incident.template';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IncidentCDto } from 'src/core/models/incident.model';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentrepository: Repository<Incident>,
    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<Incident[]> {
    try {
      console.log(
        '[IncidentService] Ejecutando query de todos los incidentes...',
      );
      const result = await this.incidentrepository.find();
      console.log(
        `[IncidentService] Se encontraron ${result.length} incidentes `,
      );
      return result;
    } catch (error) {
      console.error('[IncidentService] Error al obtener incidentes:');
      console.error(error);
      return [];
    }
  }

  async findInRadius(
    lat: number,
    lon: number,
    radius: number,
  ): Promise<Incident[]> {
    try {
      const result = await this.incidentrepository
        .createQueryBuilder('incident')
        .where(
          `ST_DWithin(
          incident.location::geography,
          ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
          :radius
        )`,
          { lat, lon, radius },
        )
        .getMany();
      return result;
    } catch (error) {
      console.error('[IncidentService] Error al obtener incidentes por radio:');
      console.error(error);
      return [];
    }
  }

  async createIncident(incident: IncidentCDto): Promise<Boolean> {
    // Save
    // Generar un nuevo registro de la entidad de Incident
    const newIncident = this.incidentrepository.create({
      title: incident.title,
      description: incident.description,
      type: incident.type,
      location: {
        type: 'Point',
        coordinates: [incident.lon, incident.lat],
      },
    });
    const generatedIncident = await this.incidentrepository.save(newIncident);
    const template = generateIncidentEmailTemplate(incident);
    const options: EmailOptions = {
      to: 'angelmirocu602@gmail.com',
      subject: incident.title,
      htmlBody: template,
    };

    const result = await this.emailService.sendEmail(options);
    return result;
  }
}
