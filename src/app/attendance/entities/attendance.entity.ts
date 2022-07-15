import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('attendance')
export class AttendanceEntity {
    @PrimaryColumn({
        generated: 'uuid',
    })
    id: string;

    @Column({type: "timestamp"})
    clockin_time: Date;

    @Column({type: "timestamp"})
    clockout_time: Date;

    @Column('text')
    latitude: string;

    @Column('text')
    longitude: string;

    @Column('boolean')
    in_range: boolean;

    @Column('boolean')
    is_present: boolean;

    @Column('uuid')
    user_id: string;

    @Column('uuid')
    store_id: string;

    @Column('uuid')
    selfie_url: string;

    @Column('date')
    date: Date;
}