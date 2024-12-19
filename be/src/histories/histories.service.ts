import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StateHistory } from './entities/state-history.entity';
import { Repository } from 'typeorm';
import { DashboardFilter } from './dto/dashboard.dto';
import { DateUtils } from 'src/utils/date.util';
import { HistoryRequest } from './dto/history.dto';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(StateHistory)
    private readonly repository: Repository<StateHistory>,
  ) {}


  public async getDashboard(query: DashboardFilter): Promise<any> {
    const data = await this.repository
      .createQueryBuilder()
      .select('AVG(altitude)', 'avgAltitude') // Thay đổi từ temperature, humidity sang altitude
      .where('DATE(recorded_at) = :today', { today: DateUtils.getTodayWithTimezone() })
      .andWhere('device_id = :deviceId', { deviceId: query.deviceId })
      .getRawOne();

    return {
      date: DateUtils.getTodayWithTimezone(),
      altitude: data.avgAltitude,
    };
  }

  public async getHistory(request: HistoryRequest) {
    const data = await this.repository
      .createQueryBuilder()
      .where('DATE(recorded_at) >= :startDate', { startDate: request.startDate })
      .andWhere('DATE(recorded_at) <= :endDate', { endDate: request.endDate })
      .andWhere('device_id = :deviceId', { deviceId: request.deviceId })
      .getMany();

    return this.processData(data, `${request.startDate} 00:00:00`, `${request.endDate} 23:59:59`);
  }

  private processData(data: any[], startTime: string, endTime: string) {
    const result: any[] = [];
    if (data.length === 0) return result;

    const interval = 2 * 60 * 60 * 1000; // 2 giờ
    data.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()); // Sắp xếp theo thời gian

    let currentStartTime = new Date(startTime);
    let currentEndTime = new Date(currentStartTime.getTime() + interval);
    let altitudeSum = 0;
    let count = 0;

    for (const record of data) {
      const recordTime = new Date(record.recordedAt);
      if (recordTime < currentEndTime) {
        altitudeSum += record.altitude;
        count++;
      } else {
        const avgAltitude = count > 0 ? altitudeSum / count : 0;
        const { year, month, day, hours, minutes, seconds } = DateUtils.parseDateWithTimezone(currentStartTime, 7);
        result.push({
          time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
          avgAltitude,
        });

        currentStartTime = currentEndTime;
        currentEndTime = new Date(currentStartTime.getTime() + interval);

        while (recordTime >= currentEndTime) {
          const { year, month, day, hours, minutes, seconds } = DateUtils.parseDateWithTimezone(currentStartTime, 7);
          result.push({
            time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            avgAltitude: 0,
          });
          currentStartTime = currentEndTime;
          currentEndTime = new Date(currentStartTime.getTime() + interval);
        }

        altitudeSum = record.altitude;
        count = 1;
      }
    }

    if (count > 0) {
      const avgAltitude = altitudeSum / count;
      const { year, month, day, hours, minutes, seconds } = DateUtils.parseDateWithTimezone(currentStartTime, 7);
      result.push({
        time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
        avgAltitude,
      });
    }

    return result;
  }
}