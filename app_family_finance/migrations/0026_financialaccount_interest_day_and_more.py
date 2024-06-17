# Generated by Django 5.0.6 on 2024-06-17 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_family_finance', '0025_remove_financialaccount_balance'),
    ]

    operations = [
        migrations.AddField(
            model_name='financialaccount',
            name='interest_day',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='financialaccount',
            name='interest_period_type',
            field=models.CharField(choices=[('Weekly', 'Weekly'), ('Monthly', 'Monthly'), ('Yearly', 'Yearly')], default='Weekly', max_length=10),
        ),
    ]